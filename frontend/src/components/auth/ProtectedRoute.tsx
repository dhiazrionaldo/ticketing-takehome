"use client";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthQuery } from "@/core/hook/useAuth";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuthQuery();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      setRedirecting(true); // flag to show loader
      console.log(user)
      router.push("/");
    }
  }, [isLoading, user, router]);

  if (isLoading == true || redirecting == true) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 mr-2" /> Loading...
      </div>
    );
  }

  if (!user) {
    // shouldn't happen, just in case
    return null;
  }

  return <>{children}</>;
}
