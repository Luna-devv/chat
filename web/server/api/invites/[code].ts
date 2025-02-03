import { HttpErrorMessage } from "~/constants/http-error";
import { db } from "~/db";
import { defineEndpoint } from "~/utils/define/endpoint";
import { httpError } from "~/utils/http-error";

export default defineEndpoint(async ({ request, c }) => {
    const code = c.req.param("code")!;

    if (request.method === "GET") return getInvite(code);

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