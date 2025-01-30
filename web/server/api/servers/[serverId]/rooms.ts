import { HttpErrorMessage } from "~/constants/http-error";
import { db } from "~/db";
import { APIPostServerRoomsBodySchema } from "~/types/rooms";
import { defineEndpoint, defineEndpointOptions } from "~/utils/define/endpoint";
import { emitGatewayEvent } from "~/utils/emit-event";
import { httpError } from "~/utils/http-error";

const options = defineEndpointOptions({
    require_auth: true,
    require_server_permissions: {
        server_owner: true
    }
});

export default defineEndpoint(async ({ request, serverId }) => {
    if (request.method === "POST") return createRoom(request, serverId!);
    httpError(HttpErrorMessage.NotFound);
}, options);

async function createRoom(request: Request, serverId: number) {
    const { data, success, error } = APIPostServerRoomsBodySchema.safeParse(await request.json());
    if (!success) throw httpError(HttpErrorMessage.BadRequest, error);

    const server = await db
        .insertInto("rooms")
        .values({
            name: data.name,
            type: data.type,
            position: 0,
            server_id: serverId
        })
        .returningAll()
        .executeTakeFirst();

    if (!server) throw httpError();

    void emitGatewayEvent(`server:${serverId}`, "room_create", server);

    return Response.json(server);
}