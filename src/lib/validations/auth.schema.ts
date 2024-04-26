import { z } from "zod";

const requiredString = z.string().min(1);

export const SignUpSchema = z.object({
  name: requiredString,
  email: requiredString.email(),
  password: z.string().min(8).max(16),
});

export type SignUpValues = z.infer<typeof SignUpSchema>;

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(16),
});

export type LoginValues = z.infer<typeof LoginSchema>;
