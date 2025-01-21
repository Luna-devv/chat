import { HttpErrorCode } from "~/constants/http-error";
import { db } from "~/db";
import { APIPostAuthLoginBodySchema } from "~/types/auth";
import { verifyPassword } from "~/utils/auth";
import { verifyCaptchaKey } from "~/utils/captcha";
import { defineEndpoint } from "~/utils/define/endpoint";
import { httpError } from "~/utils/http-error";
import { signSession } from "~/utils/jwt";

export default defineEndpoint(async ({ request }) => {
    if (request.method === "POST") return loginUser(request);
    httpError(HttpErrorCode.NotFound);
});

async function loginUser(request: Request) {
    const { data, success, error } = APIPostAuthLoginBodySchema.safeParse(await request.json());
    if (!success) throw httpError(HttpErrorCode.BadRequest, error);

    const ip = request.headers.get("CF-Connecting-IP")!;
    const captcha = await verifyCaptchaKey(data.captcha_key, ip);
    if (!captcha) httpError(HttpErrorCode.InvalidCaptcha);

    const user = await db
        .selectFrom("users")
        .select(["id", "password_hash"])
        .where("email", "=", data.email)
        .executeTakeFirst();

    if (!user) throw httpError(HttpErrorCode.EmailOrPasswordIncorrect);

    const isMatching = await verifyPassword(data.password, user.password_hash);
    if (!isMatching) throw httpError(HttpErrorCode.EmailOrPasswordIncorrect);

    return Response.json(
        { id: user.id },
        {
            headers: {
                "Set-Cookie": "session=" + signSession({ id: user.id })
            }
        }
    );
}