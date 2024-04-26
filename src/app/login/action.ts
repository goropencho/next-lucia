"use server";

import { lucia } from "@/lib/lucia";
import prisma from "@/lib/prisma";
import { LoginSchema } from "@/lib/validations/auth.schema";
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
    throw new Error("Invalid email or password");
  }

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/");
}
