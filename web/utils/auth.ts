import bcrypt from "bcrypt";
import { getUser } from "db/utils/users";

import { verifySession } from "./jwt";

export async function auth(jwt: string | null) {
    if (!jwt) return null;

    const data = await verifySession(jwt).catch(() => null);
    if (!data) return null;

    return getUser(data.id);
}

export function via(request: Request) {
    return request.headers.get("Cookie")?.split("session=")[1]?.split(";")[0] || null;
}

export function hashPassword(password: string) {
    return bcrypt.hash(password, 10);
}

export function verifyPassword(enteredPassword: string, hashedPassword: string) {
    return bcrypt.compare(enteredPassword, hashedPassword);
}