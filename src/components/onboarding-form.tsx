"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";

export function OnboardingForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const generateSlug = (input: string) => {
    return input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(generateSlug(value));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !slug) return;

    setIsPending(true);
    try {
      const { data: slugAvailable } = await authClient.organization.checkSlug({
        slug,
      });

      if (slugAvailable?.status) {
        const { data, error } = await authClient.organization.create({
          name,
          slug,
        });

        if (data?.id) {
          toast.success("Organization added successfully!");
          router.push("/");
        } else {
          toast.error(error?.message ?? "Failed to create organization.");
        }
      } else {
        toast.error("This slug is already taken. Please choose another.");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(message || "Failed to create organization");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        {" "}
        {/* Added padding-top */}
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            {" "}
            {/* Increased gap */}
            <div className="grid gap-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter your organization name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">URL Slug</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="organization-url-slug"
                  required
                  pattern="[a-z0-9-]+"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Lowercase letters, numbers, and hyphens only.
              </p>
            </div>
            <Button type="submit" disabled={isPending} className="w-full">
              {" "}
              {/* Make button full width */}
              {isPending ? "Adding..." : "Create Organization"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
