import { getSession } from "@/lib/auth";
import Link from "next/link";
import UserProfile from "./_component/Userprofile";
import { Button } from "@/components/ui/button"; // Import Button

export default async function Home() {
  const session = await getSession();
  return (
    // Remove gradient, use standard padding/layout
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background text-foreground">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        {session?.user ? (
          <UserProfile user={session.user} />
        ) : (
          // Use Button component for consistency
          <Button asChild>
             <Link href="/sign-in">Sign In</Link>
          </Button>
        )}
      </div>
    </main>
  );
}
