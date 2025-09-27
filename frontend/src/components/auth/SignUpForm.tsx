"use client";

import { useState } from "react";
import { useAuth } from "@/core/hook/useAuth";

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
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const user = await signUp(email, password);
      if (user) {
        setMessage("Account created successfully! You can now log in.");
      } else {
        setMessage("Check your email to confirm your account.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <h2 className="text-xl font-semibold">Sign Up</h2>

      <input
        className="w-full border rounded p-2"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full border rounded p-2"
        type="password"
        placeholder="********"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        className="w-full border rounded p-2"
        type="password"
        placeholder="Confirm password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />

      <button
        type="submit"
        className="w-full bg-green-600 text-white rounded p-2"
        disabled={loading}
      >
        {loading ? "Signing up..." : "Sign Up"}
      </button>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {message && <p className="text-green-600 text-sm">{message}</p>}
    </form>
  );
}
