import { validateZodSchema } from "@/lib/common/validate";
import { AuthSignUpSchema } from "@/lib/validations/auth.schema";
import { AuthService } from "@/lib/services/authService";

export async function POST(req: Request, res: Response) {
  const reqBody = await req.json();
  const authService = new AuthService();

  const validation = validateZodSchema(reqBody, AuthSignUpSchema);
  if (!validation.success) {
    return Response.json({ ...validation.errors }, { status: 400 });
  }

  const authenticatedData = await authService.signup(validation.result);
  if (!authenticatedData.success) {
    return Response.json(
      { ...authenticatedData.error },
      { status: authenticatedData.statusCode }
    );
  }

  return Response.json(
    { ...authenticatedData.data, message: authenticatedData.message },
    {
      status: authenticatedData.statusCode,
      headers: {
        "Set-Cookie": authenticatedData?.data?.sessionCookie.serialize() ?? "",
      },
    }
  );
}
