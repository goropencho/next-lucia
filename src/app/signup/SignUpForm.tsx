"use client";

import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignUpSchema, SignUpValues } from "@/lib/validations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signUp } from "./actions";
import Link from "next/router";

export default function SignUpForm() {
  const form = useForm<SignUpValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
  } = form;

  async function onSubmit(values: SignUpValues) {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });

    try {
      signUp(formData);
    } catch (err) {
      console.error(err);
      alert("Something went wrong with the server");
    }
  }
  return (
    <main>
      <div className="p-10">
        <h1 className="mb-8 font-extrabold text-4xl">Register</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Form {...form}>
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div>
                      <FormLabel className="block font-semibold">
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="w-full shadow-inner bg-gray-100 rounded-lg placeholder-black text-2xl p-4 border-none block mt-1"
                          {...field}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="mt-4">
                      <FormLabel className="block font-semibold">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="w-full shadow-inner bg-gray-100 rounded-lg placeholder-black text-2xl p-4 border-none block mt-1"
                          {...field}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="mt-4">
                      <FormLabel className="block font-semibold">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="w-full shadow-inner bg-gray-100 rounded-lg placeholder-black text-2xl p-4 border-none block mt-1"
                          {...field}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between mt-8">
                <LoadingButton
                  type="submit"
                  className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                  loading={isSubmitting}
                >
                  Register
                </LoadingButton>
                <a className="font-semibold" href="/login">
                  Already registered?
                </a>
              </div>
            </form>
          </Form>

          <aside className="">
            <div className="bg-gray-100 p-8 rounded">
              <h2 className="font-bold text-2xl">Instructions</h2>
              <ul className="list-disc mt-4 list-inside">
                <li>
                  All users must provide a valid email address and password to
                  create an account.
                </li>
                <li>
                  Users must not use offensive, vulgar, or otherwise
                  inappropriate language in their username or profile
                  information
                </li>
                <li>
                  Users must not create multiple accounts for the same person.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
