import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/common/lucia";

export default async function Page() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }
  return <h1>Hi, {user.email}!</h1>;
}
