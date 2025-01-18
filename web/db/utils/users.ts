import { db } from "db";

export function getUser(id: number) {
    return db
        .selectFrom("users")
        .selectAll()
        .executeTakeFirst();
}