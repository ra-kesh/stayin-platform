"use client";
import { authClient } from "@/lib/auth/auth-client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button"; //

type UserProps = {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string | undefined | null;
};

export default function UserProfile({ user }: { user: UserProps }) {
  const router = useRouter();
  const signOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.refresh();
        },
        onError: (ctx) => {
          alert(ctx.error.message);
        },
      },
    });
  };
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border p-4">
      {" "}
      <div className="flex items-center gap-4">
        <Avatar>
          {" "}
          {user.image ? (
            <AvatarImage src={user.image} alt={user.name ?? "user image"} />
          ) : null}
          <AvatarFallback>
            {user.name?.charAt(0).toUpperCase() ??
              user.email?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="text-left">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <Button onClick={signOut} variant="outline" size="sm">
        {" "}
        Sign out
      </Button>
    </div>
  );
}
