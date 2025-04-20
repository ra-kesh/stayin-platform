import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth"; // Use the cached getSession

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession(); // Check session here (runs in Node.js runtime)

  if (!session) {
    redirect("/sign-in"); // Redirect if not authenticated
  }

  // If authenticated, render the layout and children
  return (
    <div>
      {/* Your Dashboard Layout Components (Navbar, Sidebar, etc.) */}
      {children}
    </div>
  );
}
