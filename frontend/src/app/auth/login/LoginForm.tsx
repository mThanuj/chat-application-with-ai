"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { loginSchema } from "@/lib/schemas/auth.schema";
import { login, loginWithGoogle } from "@/actions/auth.actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export default function LoginForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      const response = await login(values);

      if (response.success) {
        toast.success(response.message);
        router.push("/");
      } else {
        toast.error(response.message);
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto py-10 w-1/3 flex flex-col space-y-8"
      >
        <div className="flex flex-col space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@doe.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="••••••" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-center flex-col w-full items-center space-y-8">
          <Button
            type="submit"
            className="text-accent w-1/2 text-lg font-semibold cursor-pointer"
          >
            Login
          </Button>
          <div className="w-1/3 flex items-center justify-center">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer w-full"
              onClick={loginWithGoogle}
            >
              Login with Google <FcGoogle />
            </Button>
          </div>
        </div>
        <div>
          <p className="text-center">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-shadow-accent-foreground font-semibold cursor-pointer hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
}
