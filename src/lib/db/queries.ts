import { and, count, eq, or } from "drizzle-orm";
import { client, db } from "./drizzle";
import {
  members,
  users,

} from "./schema";

export async function getActiveOrganization(userId: string) {
  const result = await db
    .select({
      organizationId: members.organizationId,
    })
    .from(users)
    .leftJoin(members, eq(users.id, members.userId))
    .where(eq(users.id, userId))
    .limit(1);

  return result[0];
}

