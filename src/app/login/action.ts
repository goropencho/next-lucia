"use server";

import { lucia } from "@/lib/common/lucia";
import prisma from "@/lib/common/prisma";
import { LoginSchema } from "@/lib/validations/auth.schema";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Login(formData: FormData) {
  const values = Object.fromEntries(formData.entries());

  const { email, password } = LoginSchema.parse(values);

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user || user.password != password) {
    return {
      error: "Invalid Credentials provided",
    };
  }

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  revalidatePath("/");
  redirect("/dashboard");

  return {};
}
