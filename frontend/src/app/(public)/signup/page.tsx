import { SignUpForm } from "@/components/auth/SignUpForm";

/**
 * SignUpPage
 *
 * Purpose:
 *  - Render the sign-up form in a standalone page.
 */
export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUpForm />
    </div>
  );
}
