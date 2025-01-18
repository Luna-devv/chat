import { HttpErrorCode } from "constants/http-error";
import { db } from "db";
import type { LoaderFunctionArgs } from "react-router";
import { APIPostUserBodySchema } from "types/users";
import { auth, hashPassword } from "utils/auth";
import { verifyCaptchaKey } from "utils/captcha";
import { httpError } from "utils/http-error";
import { signSession } from "utils/jwt";

export async function loader({ request }: LoaderFunctionArgs) {
    if (request.method === "POST") return createUser({ request });

    const user = await auth(request.headers.get("authorization"));
    if (!user) throw httpError(HttpErrorCode.InvalidAuthorization);

    switch (request.method) {
        case "GET": return user;
    }

    throw httpError(HttpErrorCode.NotFound);
}

async function createUser({ request }: Pick<LoaderFunctionArgs, "request">) {
    const { data, success, error } = APIPostUserBodySchema.safeParse(await request.json());
    if (!success) throw httpError(HttpErrorCode.BadRequest, error);

    const ip = request.headers.get("CF-Connecting-IP")!;
    const captcha = await verifyCaptchaKey(data.captcha_key, ip);
    if (!captcha) throw httpError(HttpErrorCode.BadRequest);

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

    if (!user) throw httpError(HttpErrorCode.UsernameAlreadyClaimed);

    return Response.json(
        user,
        {
            headers: {
                "Set-Cookie": "session=" + signSession({ id: user.id })
            }
        }
    );
}