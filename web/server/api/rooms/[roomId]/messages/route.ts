import { HttpErrorMessage } from "~/constants/http-error";
import { db } from "~/db";
import { APIGetRoomMessagesQuerySchema, APIPostRoomMessagesBodySchema, MessageType } from "~/types/messages";
import { defineEndpoint, defineEndpointOptions } from "~/utils/define/endpoint";
import { emitGatewayEvent } from "~/utils/emit-event";
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

    if (userId !== room?.owner_id) httpError(HttpErrorMessage.MissingAccess);

    if (request.method === "GET") return getMessages(request, roomId);
    if (request.method === "POST") return createMessage(request, userId, room!.server_id, roomId);

    httpError(HttpErrorMessage.NotFound);
}, options);

async function getMessages(request: Request, roomId: number) {
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams);

    const { data, success, error } = APIGetRoomMessagesQuerySchema.safeParse(searchParams);
    if (!success) throw httpError(HttpErrorMessage.BadRequest, error);

    const messages = await db
        .selectFrom("messages")
        .where("room_id", "=", roomId)
        .where("id", "<", data.before)
        .selectAll()
        .limit(data.limit)
        .orderBy("created_at desc")
        .execute();

    return Response.json(messages);
}

async function createMessage(request: Request, userId: number, serverId: number, roomId: number) {
    const { data, success, error } = APIPostRoomMessagesBodySchema.safeParse(await request.json());
    if (!success) throw httpError(HttpErrorMessage.BadRequest, error);

    const message = await db
        .insertInto("messages")
        .values({
            content: data.content,
            type: MessageType.Default,
            room_id: roomId,
            author_id: userId
        })
        .returningAll()
        .executeTakeFirst();

    if (!message) throw httpError();

    void emitGatewayEvent(`server:${serverId}`, "message_create", message);

    return Response.json(message);
}