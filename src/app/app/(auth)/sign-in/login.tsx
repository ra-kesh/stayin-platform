"use client";

// Remove Link and SVGProps imports if no longer needed
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui/button"; // Import shadcn Button
import { Input } from "@/components/ui/input"; // Import shadcn Input
import { Label } from "@/components/ui/label"; // Import shadcn Label
import { Checkbox } from "@/components/ui/checkbox"; // Import shadcn Checkbox
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Import shadcn Card components
import Link from "next/link"; // Keep Link for sign-up/forgot password

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    // Use authClient which already uses toast for errors
    authClient.signIn.email(
      { email, password, rememberMe: remember },
      {
        onRequest: () => setLoading(true),
        onSuccess: () => router.push("/"), // Keep setLoading(false) out of onSuccess for redirects
        onError: () => setLoading(false), // setLoading false only on error
        // onResponse is called for both success and error after the request finishes
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
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={signIn} className="space-y-4">
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
                autoComplete="current-password"
                disabled={loading}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox // Use shadcn Checkbox
                  id="remember-me"
                  checked={remember}
                  onCheckedChange={(checked) => setRemember(Boolean(checked))}
                  disabled={loading}
                />
                <Label
                  htmlFor="remember-me"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </Label>
              </div>
              <div className="text-sm">
                <Link
                  href="#" // Add actual forgot password link later
                  className="font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {" "}
              {/* Use shadcn Button */}
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm">
          Don't have an account?{" "}
          <Link
            href="/sign-up"
            className="ml-1 font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

// Remove GithubIcon and GoogleIcon components if they existed and are not used
