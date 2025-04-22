import React from "react";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/drizzle";
import { organizations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

async function checkOnboardingStatus(organizationId: string) {
  const org = await db.query.organizations.findFirst({
    where: eq(organizations.id, organizationId),
  });

  return org?.isOnboarded;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  console.log({ session });

  if (!session?.user) {
    redirect("/sign-in");
  }

  // If no active organization, redirect to onboarding
  if (!session.session.activeOrganizationId) {
    redirect("/onboarding");
  }

  // // Check if onboarding is completed
  // const isOnboardingCompleted = await checkOnboardingStatus(
  //   session.session.activeOrganizationId
  // );

  // if (!isOnboardingCompleted) {
  //   redirect("/onboarding");
  // }

  return <div className="min-h-screen flex flex-col">{children}</div>;
}
