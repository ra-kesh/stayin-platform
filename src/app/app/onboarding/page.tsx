import { OnboardingForm } from "@/components/onboarding-form";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Welcome to Stay In Puri</h1>
        <p className="text-muted-foreground">
          Let's set up your organization to get started
        </p>
      </div>
      <OnboardingForm user={session.user} />
    </div>
  );
}
