import { HttpErrorCode } from "~/constants/http-error";
import { db } from "~/db";
import { getUserIdByEmail, getUserIdByUsername } from "~/db/utils/users";
import { APIPostAuthRegisterBodySchema } from "~/types/auth";
import { hashPassword } from "~/utils/auth";
import { verifyCaptchaKey } from "~/utils/captcha";
import { defineEndpoint } from "~/utils/define/endpoint";
import { httpError } from "~/utils/http-error";
import { signSession } from "~/utils/jwt";

export default defineEndpoint(async ({ request }) => {
    if (request.method === "POST") return createUser(request);
    httpError(HttpErrorCode.NotFound);
});

async function createUser(request: Request) {
    const { data, success, error } = APIPostAuthRegisterBodySchema.safeParse(await request.json());
    if (!success) throw httpError(HttpErrorCode.BadRequest, error);

    const ip = request.headers.get("CF-Connecting-IP")!;
    const captcha = await verifyCaptchaKey(data.captcha_key, ip);
    if (!captcha) httpError(HttpErrorCode.InvalidCaptcha);

    if (await getUserIdByUsername(data.username)) httpError(HttpErrorCode.UsernameAlreadyClaimed);
    if (await getUserIdByEmail(data.email)) httpError(HttpErrorCode.EmailAlreadyRegistered);

    const user = await db
        .insertInto("users")
        .values({
            email: data.email,
            password_hash: await hashPassword(data.password),
            username: data.username
        })
        .returning("id")
        .executeTakeFirstOrThrow()
        .catch(() => null);

    if (!user) throw httpError();

    return Response.json(
        user,
        {
            headers: {
                "Set-Cookie": "session=" + signSession({ id: user.id })
            }
        }
    );
}