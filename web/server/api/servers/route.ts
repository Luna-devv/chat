import { HttpErrorMessage } from "~/constants/http-error";
import { db } from "~/db";
import type { GatewayServer } from "~/types/server";
import { APIPostServersBodySchema } from "~/types/server";
import { verifyCaptchaKey } from "~/utils/captcha";
import { defineEndpoint, defineEndpointOptions } from "~/utils/define/endpoint";
import { emitGatewayEvent } from "~/utils/emit-event";
import { httpError } from "~/utils/http-error";

const options = defineEndpointOptions({
    require_auth: true
});

export default defineEndpoint(async ({ request, userId }) => {
    if (request.method === "POST") return createServer(request, userId);
    httpError(HttpErrorMessage.NotFound);
}, options);

async function createServer(request: Request, userId: number) {
    const { data, success, error } = APIPostServersBodySchema.safeParse(await request.json());
    if (!success) throw httpError(HttpErrorMessage.BadRequest, error);

    const ip = request.headers.get("CF-Connecting-IP")!;
    const captcha = await verifyCaptchaKey(data.captcha_key, ip);
    if (!captcha) httpError(HttpErrorMessage.InvalidCaptcha);

    const server = await db
        .insertInto("servers")
        .values({
            name: data.name,
            owner_id: userId
        })
        .returningAll()
        .executeTakeFirst();

    if (!server) throw httpError();

    const member = await db
        .insertInto("server_members")
        .values({
            user_id: userId,
            server_id: server.id
        })
        .returningAll()
        .executeTakeFirst();

    if (!member) throw httpError();

    Object.assign(server, { rooms: [] });
    void emitGatewayEvent(`user:${userId}`, "server_create", server as GatewayServer);

    return Response.json(server);
}