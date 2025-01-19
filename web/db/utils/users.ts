import { db } from "db";

export function getUser(id: number) {
    return db
        .selectFrom("users")
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirst();
}