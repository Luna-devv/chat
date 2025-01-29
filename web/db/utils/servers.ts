import { db } from "db";

export async function getServerOwnerId(id: number) {
    const server = await db
        .selectFrom("servers")
        .select("owner_id")
        .where("id", "=", id)
        .executeTakeFirst();

    return server?.owner_id || null;
}