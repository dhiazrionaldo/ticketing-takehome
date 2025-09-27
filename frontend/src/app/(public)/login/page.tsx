import { LoginForm } from "@/components/auth/LoginForm";

/**
 * LoginPage
 *
 * Purpose:
 *  - Render the login form in a standalone page.
 */
export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoginForm />
    </div>
  );
}
