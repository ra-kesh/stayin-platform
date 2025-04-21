import "dotenv/config";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import { db } from "../db/drizzle";
import { admin, organization, username } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { getActiveOrganization } from "../db/queries";
import { cache } from "react";
import { headers } from "next/headers";
import { validateEnv } from "../env";

validateEnv();

const allowedOrigins = [
  "http://app.localhost:3000",
  "https://app.stayinpuri.com",
  "https://stayinpuri.com",
  "http://localhost:3000",
];

const validOrigins = allowedOrigins.filter(Boolean) as string[];

export const auth = betterAuth({
  appName: "Stay In Puri",
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ url }) {
      console.log("Reset password URL:", url);
    },
  },
  secret: process.env.BETTER_AUTH_SECRET as string,
  plugins: [
    username(),
    admin(),
    organization({
      //todo: add custom logic later based on subscription
      allowUserToCreateOrganization: true,
    }),
    nextCookies(),
  ],
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const organization = await getActiveOrganization(session.userId);
          return {
            data: {
              ...session,
              activeOrganizationId: organization.organizationId,
            },
          };
        },
      },
    },
  },

  trustedOrigins: validOrigins,

  cors: {
    origin: validOrigins,
    credentials: true,
  },

  advanced: {
    ipAddress: {
      ipAddressHeaders: ["x-client-ip", "x-forwarded-for"],
      disableIpTracking: false,
    },
    // crossSubDomainCookies: {
    //   enabled: true,
    //   domain: `.localhost`,
    // },
    // defaultCookieAttributes: {
    //   secure: true,
    //   httpOnly: true,
    //   sameSite: "none", // Allows CORS-based cookie sharing across subdomains
    //   partitioned: true, // New browser standards will mandate this for foreign cookies
    // },
  },
});

export const getSession = cache(async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
});
