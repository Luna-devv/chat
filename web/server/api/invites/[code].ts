import { jsonObjectFrom } from "kysely/helpers/postgres";

import { HttpErrorMessage } from "~/constants/http-error";
import { db } from "~/db";
import { APIPostInviteBodySchema } from "~/types/invites";
import { auth, via } from "~/utils/auth";
import { verifyCaptchaKey } from "~/utils/captcha";
import { defineEndpoint } from "~/utils/define/endpoint";
import { emitGatewayEvent } from "~/utils/emit-event";
import { httpError } from "~/utils/http-error";

export default defineEndpoint(async ({ request, c }) => {
    const code = c.req.param("code")!;

    if (request.method === "GET") return getInvite(code);
    if (request.method === "POST") return joinServer(request, code);

    httpError(HttpErrorMessage.NotFound);
});

async function getInvite(code: string) {
    const invite = await db
        .selectFrom("invites")
        .selectAll()
        .where("code", "=", code)
        .where((eb) =>
            eb.or([
                eb("expires_at", "is", null),
                eb("expires_at", ">", new Date().toISOString())
            ])
        )
        .executeTakeFirst();

    if (!invite) throw httpError(HttpErrorMessage.UnknownInvite);

    Object.assign(invite, { uses: 0 });
    return Response.json(invite);
}

async function joinServer(request: Request, code: string) {
    const userId = await auth(via(request));
    if (!userId) throw httpError(HttpErrorMessage.InvalidAuthorization);

    const { data, success, error } = APIPostInviteBodySchema.safeParse(await request.json());
    if (!success) throw httpError(HttpErrorMessage.BadRequest, error);

    const ip = request.headers.get("CF-Connecting-IP")!;
    const captcha = await verifyCaptchaKey(data.captcha_key, ip);
    if (!captcha) httpError(HttpErrorMessage.InvalidCaptcha);

    const invite = await db
        .selectFrom("invites")
        .select(["server_id", "room_id"])
        .where("code", "=", code)
        .where((eb) =>
            eb.or([
                eb("expires_at", "is", null),
                eb("expires_at", ">", new Date().toISOString())
            ])
        )
        .select((eb) => [
            jsonObjectFrom(
                eb
                    .selectFrom("servers")
                    .whereRef("invites.server_id", "=", "servers.id")
                    .selectAll()
            )
                .as("server")
        ])
        .executeTakeFirst();

    if (!invite) throw httpError(HttpErrorMessage.UnknownInvite);

    const member = await db
        .insertInto("server_members")
        .values({
            user_id: userId,
            server_id: invite.server_id
        })
        .returningAll()
        .onConflict((oc) => (
            oc.doNothing()
        ))
        .executeTakeFirst();

    if (!member) throw httpError(); // will 500 if you are already in the server I guess,,,

    void emitGatewayEvent(`user:${userId}`, "server_create", invite.server!);

    Object.assign(member, { invite_room_id: invite.room_id });
    return Response.json(member);
}