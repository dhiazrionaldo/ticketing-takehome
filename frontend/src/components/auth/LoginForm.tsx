"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useAuthQuery } from "@/core/hook/useAuth";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Loader2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

/**
 * LoginForm schema
 */
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * LoginForm (ShadCN UI + password toggle)
 *
 * Purpose:
 *  - Login with email/password using Supabase
 *  - Role-based redirect (admin -> /event, others -> /purchase)
 *  - Show/Hide password field toggle
 */
export function LoginForm() {
  const router = useRouter();
  const { signIn } = useAuthQuery();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      const user = await signIn(values);

      if (!user) {
        toast.error("Login failed. Please check your credentials.");
        return;
      }

      // ✅ Redirect based on role
      
        toast.success("Welcome!");
        router.replace("/");
      
    } catch (err: any) {
      console.error("Login error:", err);
      toast.error(err.message || "Login error");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-sm mx-auto"
      >
        <h2 className="text-xl font-semibold">Login</h2>

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field with Toggle */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    placeholder="********"
                    type={showPassword ? "text" : "password"}
                    {...field}
                  />
                </FormControl>
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <Loader2 className="animate-spin h-4 w-4" />
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </Form>
  );
}
