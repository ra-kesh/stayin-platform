"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui/button"; // Import shadcn Button
import { Input } from "@/components/ui/input"; // Import shadcn Input
import { Label } from "@/components/ui/label"; // Import shadcn Label
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Import shadcn Card components

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    // Use authClient which already uses toast for errors
    authClient.signUp.email(
      { email, password, name, image: undefined },
      {
        onRequest: () => setLoading(true),
        onSuccess: () => router.push("/"), // Keep setLoading(false) out of onSuccess for redirects
        onError: () => setLoading(false), // setLoading false only on error
        onResponse: () => {
          // Optional: Can also set loading false here if needed after redirect starts or error occurs
          // setLoading(false);
        },
      }
    );
  };

  return (
    // Remove the outer div with gradient background
    // Use flex container to center the card
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={signUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input // Use shadcn Input
                id="name"
                name="name"
                type="text" // Correct type for name
                required
                value={name} // Controlled component
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input // Use shadcn Input
                id="email"
                name="email"
                type="email"
                required
                value={email} // Controlled component
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="name@example.com"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input // Use shadcn Input
                id="password"
                name="password"
                type="password"
                required
                value={password} // Controlled component
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password" // Use new-password for sign up
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {" "}
              {/* Use shadcn Button */}
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="ml-1 font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
