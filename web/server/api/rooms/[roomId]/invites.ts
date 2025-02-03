import { HttpErrorMessage } from "~/constants/http-error";
import { db } from "~/db";
import { defineEndpoint, defineEndpointOptions } from "~/utils/define/endpoint";
import { httpError } from "~/utils/http-error";

const options = defineEndpointOptions({
    route_type: "room",
    require_auth: true
});

export default defineEndpoint(async ({ request, userId, roomId }) => {

    // me when no member logic exists,,,
    const room = await db
        .selectFrom("rooms")
        .where("rooms.id", "=", roomId)
        .innerJoin("servers", "servers.id", "server_id")
        .select(["server_id", "owner_id"])
        .executeTakeFirst();

    if (userId !== room?.owner_id) throw httpError(HttpErrorMessage.MissingAccess);

    if (request.method === "POST") return createInvite(userId, room.server_id, roomId);

    httpError(HttpErrorMessage.NotFound);
}, options);

async function createInvite(userId: number, serverId: number, roomId: number) {

    const invite = await db.transaction().execute(async () => {
        const existingInvite = await db
            .selectFrom("invites")
            .selectAll()
            .where("author_id", "=", userId)
            .where("room_id", "=", roomId)
            .where("expires_at", "is", null) // idk what logic to apply if a user selects an expired timestamp
            .executeTakeFirst();

        console.log(existingInvite);
        if (existingInvite) return existingInvite;

        return db
            .insertInto("invites")
            .values({
                code: generateInviteCode(), // pray``

                server_id: serverId,
                room_id: roomId,
                author_id: userId

                // expires_at: new Date(Date.now() + (1_000 * 60 * 60 * 24 * 7)).toISOString()
            })
            .returningAll()
            .executeTakeFirstOrThrow();
    });

    return Response.json(invite);
}

function generateInviteCode(length: number = 8) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }

    return code;
}