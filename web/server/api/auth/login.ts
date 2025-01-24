import { HttpErrorMessage } from "~/constants/http-error";
import { db } from "~/db";
import { APIPostAuthLoginBodySchema, UserAuthRequiredAction } from "~/types/auth";
import { UserFlags } from "~/types/users";
import { verifyPassword } from "~/utils/auth";
import { BitfieldManager } from "~/utils/bitfields";
import { verifyCaptchaKey } from "~/utils/captcha";
import { defineEndpoint } from "~/utils/define/endpoint";
import { httpError } from "~/utils/http-error";
import { session } from "~/utils/jwt";

export default defineEndpoint(async ({ request }) => {
    if (request.method === "POST") return loginUser(request);
    httpError(HttpErrorMessage.NotFound);
});

async function loginUser(request: Request) {
    const { data, success, error } = APIPostAuthLoginBodySchema.safeParse(await request.json());
    if (!success) throw httpError(HttpErrorMessage.BadRequest, error);

    const ip = request.headers.get("CF-Connecting-IP")!;
    const captcha = await verifyCaptchaKey(data.captcha_key, ip);
    if (!captcha) httpError(HttpErrorMessage.InvalidCaptcha);

    const user = await db
        .selectFrom("users")
        .select(["id", "username", "email", "flags", "password_hash"])
        .where("email", "=", data.email)
        .executeTakeFirst();

    if (!user) throw httpError(HttpErrorMessage.EmailOrPasswordIncorrect);

    const isMatching = await verifyPassword(data.password, user.password_hash);
    if (!isMatching) throw httpError(HttpErrorMessage.EmailOrPasswordIncorrect);

    const requiredActions: UserAuthRequiredAction[] = [];
    const flags = new BitfieldManager(user.flags);

    if (!flags.has(UserFlags.VerifiedEmail)) requiredActions.push(UserAuthRequiredAction.VerifyEmail);

    return Response.json(
        {
            required_actions: requiredActions
        },
        {
            headers: requiredActions.length
                ? undefined
                : {
                    "Set-Cookie": "session=" + session.sign({ id: user.id })
                }
        }
    );
}