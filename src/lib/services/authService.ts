import { Argon2id } from "oslo/password";
import { UserRepository } from "../repository/userRepository";
import { generateIdFromEntropySize } from "lucia";
import { githubAuth, lucia } from "../common/lucia";

export class AuthService {
  private userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepository();
  }

  async signup(request: SignUpReqDto): Promise<ResponseResDto<SignUpResDto>> {
    const existingUser = await this.userRepository.getOneByEmail(request.email);
    if (existingUser) {
      return {
        success: false,
        data: null,
        error: {
          errors: [`User with email ${request.email} already exist!`],
        },
        message: "",
        statusCode: 400,
      };
    }

    const hashedPassword = await new Argon2id().hash(request.password);
    const userId = generateIdFromEntropySize(10);
    const createdUser = await this.userRepository.create({
      id: userId,
      name: request.name,
      email: request.email,
      password: hashedPassword,
      github_id: null,
      username: null,
      createdAt: new Date(),
      updatedAt: null,
    });

    const session = await lucia.createSession(createdUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    return {
      success: true,
      data: {
        sessionId: session.id,
        sessionCookie: sessionCookie,
      },
      message: "User Sign Up Completed Successfully!",
      error: {
        errors: [],
      },
      statusCode: 200,
    };
  }

  async login(request: LoginDto): Promise<ResponseResDto<LoginResDto>> {
    const existingUser = await this.userRepository.getOneByEmail(request.email);
    if (!existingUser) {
      return {
        success: false,
        data: null,
        error: {
          errors: ["Incorrect Email or Password!"],
        },
        message: "",
        statusCode: 400,
      };
    }

    const validPassword = await new Argon2id().verify(
      String(existingUser.password),
      request.password
    );
    if (!validPassword) {
      return {
        success: false,
        data: null,
        error: {
          errors: ["Incorrect Email or Password!"],
        },
        message: "",
        statusCode: 400,
      };
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    return {
      success: true,
      data: {
        sessionId: session.id,
        sessionCookie: sessionCookie,
      },
      error: {
        errors: [],
      },
      message: "User Log In Completed Successfully!",
      statusCode: 200,
    };
  }
  async logout(sessionId: string): Promise<ResponseResDto<LogOutResDto>> {
    const { session, user } = await lucia.validateSession(sessionId);
    if (!session) {
      return {
        success: false,
        data: null,
        error: {
          errors: ["Session Not Found!"],
        },
        message: "",
        statusCode: BAD_REQUEST_CODE,
      };
    }

    await lucia.invalidateSession(sessionId);
    const sessionCookie = lucia.createBlankSessionCookie();

    return {
      success: true,
      data: {
        sessionId: "",
        sessionCookie: sessionCookie,
      },
      error: {
        errors: [],
      },
      message: "User Log out Completed Successfully!",
      statusCode: OK_CODE,
    };
  }
  async github(
    code: string,
    state: string
  ): Promise<ResponseResDto<GithubResDto>> {
    const tokens = await githubAuth.validateAuthorizationCode(code);
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const githubUser: GitHubUser = await githubUserResponse.json();
    const existingUser = await this.userRepository.getOneByGithubId(
      githubUser.id
    );
    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      return {
        success: true,
        data: {
          sessionId: session.id,
          sessionCookie: sessionCookie,
        },
        message: "User Log In Completed Successfully!",
        error: {
          errors: [],
        },
        statusCode: 200,
      };
    }
    const userId = generateIdFromEntropySize(10);
    const createdUser = await this.userRepository.create({
      id: userId,
      email: null,
      password: null,
      name: null,
      github_id: BigInt(githubUser.id),
      username: githubUser.login,
      createdAt: new Date(),
      updatedAt: null,
    });
    const session = await lucia.createSession(createdUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    return {
      success: true,
      data: {
        sessionId: session.id,
        sessionCookie: sessionCookie,
      },
      message: "User Sign Up Completed Successfully!",
      error: {
        errors: [],
      },
      statusCode: 200,
    };
  }
}

interface GitHubUser {
  id: number;
  login: string;
}
