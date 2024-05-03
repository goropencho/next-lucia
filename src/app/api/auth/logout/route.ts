import { validateRequest } from "@/lib/common/lucia";
import { AuthService } from "@/lib/services/authService";

export async function POST(req: Request, res: Response) {
  const authorizationHeader = req.headers.get("Authorization");
  const { session } = await validateRequest(authorizationHeader);
  if (!session) {
    return Response.json({}, { status: 401 });
  }

  const authService = new AuthService();
  const logoutData = await authService.logout(session.id);
  if (!logoutData.success) {
    return Response.json(
      { ...logoutData.error },
      { status: logoutData.statusCode }
    );
  }

  return Response.json(
    { ...logoutData.data, message: logoutData.message },
    {
      status: logoutData.statusCode,
      headers: {
        "Set-Cookie": logoutData?.data?.sessionCookie.serialize() ?? "",
      },
    }
  );
}
