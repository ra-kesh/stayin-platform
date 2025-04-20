import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth"; // Use the cached getSession

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession(); // Check session here

  if (session) {
    redirect("/"); // Redirect if already authenticated
  }

  // If not authenticated, render the auth page (sign-in, sign-up)
  return <>{children}</>;
}
