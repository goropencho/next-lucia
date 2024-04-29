"use client";

import LoadingButton from "@/components/LoadingButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginSchema, LoginValues } from "@/lib/validations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import login from "./action";
import { useEffect, useState } from "react";
import { AlertError } from "@/components/AlertError";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default function LoginForm() {
  const form = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
  });

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
  } = form;

  const { toast } = useToast();
  const [error, setError] = useState("");

  useEffect(() => {
    if (error != "") {
      toast({
        title: error,
      });
    }
  }, [error, toast]);

  async function onSubmit(values: LoginValues) {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });

    try {
      const result = await login(formData);
      if (result.error) {
        setError(result.error);
      }
    } catch (err: any) {
      console.log("err", err.message);
      setError(err.message);
    }
  }

  return (
    <main>
      <Toaster />
      <div className="h-screen bg-gray-200 py-20 p-4 md:p-20 lg:p-32">
        <div className="max-w-sm bg-white rounded-lg overflow-hidden shadow-lg mx-auto">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome Back!
            </h2>
            <p className="text-gray-700 mb-6">Please sign in to your account</p>
            <Form {...form}>
              <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="block text-gray-700 font-bold mb-2">
                          Username
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            {...field}
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="mb-6">
                        <FormLabel className="block text-gray-700 font-bold mb-2">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            {...field}
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <LoadingButton
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                    loading={isSubmitting}
                  >
                    Sign In
                  </LoadingButton>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
}
