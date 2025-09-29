"use client";

import { useState } from "react";
import { useAuthQuery } from "@/core/hook/useAuth";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Validation schema with zod
const formSchema = z
  .object({
    email: z.string().email({ message: "Please enter a valid email." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    confirm: z.string().min(6, { message: "Please confirm your password." }),
  })
  .refine((data) => data.password === data.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  });

/**
 * SignUpForm component
 *
 * Purpose:
 *  - Provide UI for user registration with email/password.
 *  - Call useAuth.signUp to create account.
 *
 * Behavior:
 *  - Controlled form (email, password, confirm password).
 *  - Shows success or error message.
 */

export function SignUpForm() {
  const router = useRouter();
  const { signUp } = useAuthQuery();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirm: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const user = await signUp({ email: values.email, password: values.password });
      if (user) {
        setMessage("Account created successfully! You can now log in.");
        toast.success("Account created successfully! You can now log in.");
        router.replace("/login");
      } else {
        setMessage("Check your email to confirm your account.");
        toast.success("Check your email to confirm your account.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign up");
      toast.error(err.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-96 rounded-md border p-5 relative bg-slate-900">
      <h2 className="text-xl font-semibold mb-4">Sign Up</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
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

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input placeholder="********" type={showPassword ? "text" : "password"} {...field} />
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

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input placeholder="********" type={showPassword ? "text" : "password"} {...field} />
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

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing up...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {message && <p className="text-green-600 text-sm">{message}</p>}
        </form>
      </Form>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import { useAuthQuery } from "@/core/hook/useAuth";
// import toast from "react-hot-toast";

// /**
//  * SignUpForm component
//  *
//  * Purpose:
//  *  - Provide UI for user registration with email/password.
//  *  - Call useAuth.signUp to create account.
//  *
//  * Behavior:
//  *  - Controlled form (email, password, confirm password).
//  *  - Shows success or error message.
//  */
// export function SignUpForm() {
//   const { signUp } = useAuthQuery();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [message, setMessage] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setError(null);
//     setMessage(null);

//     if (password !== confirm) {
//       setError("Passwords do not match");
//       return;
//     }

//     setLoading(true);
//     try {
//       const user = await signUp(email, password);
//       if (user) {
//         setMessage("Account created successfully! You can now log in.");
//         toast.success("Account created successfully! You can now log in.");
//       } else {
//         setMessage("Check your email to confirm your account.");
//         toast.success("Check your email to confirm your account.");
//       }
//     } catch (err: any) {
//       setError(err.message || "Failed to sign up");
//       toast.error(err.message || "Failed to sign up");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
//       <h2 className="text-xl font-semibold">Sign Up</h2>

//       <input
//         className="w-full border rounded p-2"
//         type="email"
//         placeholder="you@example.com"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />

//       <input
//         className="w-full border rounded p-2"
//         type="password"
//         placeholder="********"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />

//       <input
//         className="w-full border rounded p-2"
//         type="password"
//         placeholder="Confirm password"
//         value={confirm}
//         onChange={(e) => setConfirm(e.target.value)}
//       />

//       <button
//         type="submit"
//         className="w-full bg-green-600 text-white rounded p-2"
//         disabled={loading}
//       >
//         {loading ? "Signing up..." : "Sign Up"}
//       </button>

//       {error && <p className="text-red-600 text-sm">{error}</p>}
//       {message && <p className="text-green-600 text-sm">{message}</p>}
//     </form>
//   );
// }
