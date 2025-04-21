import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";
import { toast } from "sonner";
import { admin, username } from "better-auth/plugins";

export const authClient = createAuthClient({
  baseURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth`,
  plugins: [organizationClient(), username(), admin()],
  fetchOptions: {
    onError: (ctx) => {
      toast.error(ctx.error.message);
    },
  },
});

export const { useSession, signOut, signIn } = authClient;
