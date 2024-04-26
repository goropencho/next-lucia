"use server";

import { lucia } from "@/lib/lucia";
import prisma from "@/lib/prisma";
import { SignUpSchema } from "@/lib/validations/auth.schema";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";

export async function signUp(formdata: FormData): Promise<ActionResult> {
  const values = Object.fromEntries(formdata.entries());

  const { name, email, password } = SignUpSchema.parse(values);

  const alreadyExists = await prisma.user.count({
    where: {
      email,
    },
  });
  if (alreadyExists > 0) {
    return {
      error: "User already exists!",
    };
  }
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/");
}

interface ActionResult {
  error: string;
}
