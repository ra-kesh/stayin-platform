const requiredEnvs = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_ROOT_DOMAIN",
  "DATABASE_URL",
  "BETTER_AUTH_SECRET",
] as const;

export function validateEnv() {
  for (const env of requiredEnvs) {
    if (!process.env[env]) {
      throw new Error(`Missing required environment variable: ${env}`);
    }
  }
}
