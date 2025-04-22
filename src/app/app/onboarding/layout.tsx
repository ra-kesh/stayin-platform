import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  if (session.session.activeOrganizationId) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-xl px-4">{children}</div>
    </div>
  );
}
