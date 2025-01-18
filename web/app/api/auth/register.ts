import type { LoaderFunctionArgs } from "react-router";

import { HttpErrorCode } from "~/constants/http-error";
import { db } from "~/db";
import { APIPostAuthRegisterBodySchema } from "~/types/auth";
import { hashPassword } from "~/utils/auth";
import { verifyCaptchaKey } from "~/utils/captcha";
import { httpError } from "~/utils/http-error";
import { signSession } from "~/utils/jwt";

import type { Route } from ".react-router/types/app/api/auth/+types/register";

export async function action({ request }: Route.ActionArgs) {
    if (request.method === "POST") return createUser({ request });
    throw httpError(HttpErrorCode.NotFound);
}

async function createUser({ request }: Pick<LoaderFunctionArgs, "request">) {
    const { data, success, error } = APIPostAuthRegisterBodySchema.safeParse(await request.json());
    if (!success) throw httpError(HttpErrorCode.BadRequest, error);

    const ip = request.headers.get("CF-Connecting-IP")!;
    const captcha = await verifyCaptchaKey(data.captcha_key, ip);
    if (!captcha) throw httpError(HttpErrorCode.InvalidCaptcha);

    const usernameClaimed = await db
        .selectFrom("users")
        .select("username")
        .where("username", "=", data.username)
        .execute();

    if (usernameClaimed.length !== 0) throw httpError(HttpErrorCode.UsernameAlreadyClaimed);

    const user = await db
        .insertInto("users")
        .values({
            email: data.email,
            password_hash: await hashPassword(data.password),
            username: data.username
        })
        .returningAll()
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