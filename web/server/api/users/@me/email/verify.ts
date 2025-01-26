import { HttpErrorMessage } from "~/constants/http-error";
import { db } from "~/db";
import { APIPostCurrentUserEmailVerifyBodySchema, UserFlags } from "~/types/users";
import { generateCookieHeaderFromJWT } from "~/utils/auth";
import { BitfieldManager } from "~/utils/bitfields";
import { verifyCaptchaKey } from "~/utils/captcha";
import { defineEndpoint } from "~/utils/define/endpoint";
import { httpError } from "~/utils/http-error";
import { session, verifyemail } from "~/utils/jwt";

export default defineEndpoint(async ({ request }) => {
    if (request.method === "POST") return verifyEmail(request);
    httpError(HttpErrorMessage.NotFound);
});

async function verifyEmail(request: Request) {
    const { data, success, error } = APIPostCurrentUserEmailVerifyBodySchema.safeParse(await request.json());
    if (!success) throw httpError(HttpErrorMessage.BadRequest, error);

    const ip = request.headers.get("CF-Connecting-IP")!;
    const captcha = await verifyCaptchaKey(data.captcha_key, ip);
    if (!captcha) httpError(HttpErrorMessage.InvalidCaptcha);

    const payload = await verifyemail.verify(data.token);
    if (!payload) throw httpError(HttpErrorMessage.InvalidAuthorization);

    const user = await db
        .selectFrom("users")
        .select("flags")
        .where("id", "=", payload.user_id)
        .executeTakeFirst();

    if (!user) throw httpError(HttpErrorMessage.UnknownAccount);

    await db
        .updateTable("users")
        .where("id", "=", payload.user_id)
        .set({
            email: payload.email,
            flags: new BitfieldManager(user?.flags).add(UserFlags.VerifiedEmail).flags
        })
        .execute();

    return new Response(
        null,
        {
            status: 204,
            headers: {
                "Set-Cookie": generateCookieHeaderFromJWT(session.sign({ id: payload.user_id }))
            }
        }
    );
}