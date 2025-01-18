import jwt from "jsonwebtoken";
import { createHash } from "node:crypto";
import type { UserJWTPayload } from "types/users";

const secret = createHash("sha256")
    .update(process.env.SECRET!)
    .digest("hex");

export function signSession(data: UserJWTPayload) {
    return jwt.sign(data, secret);
}

export async function verifySession(token: string): Promise<UserJWTPayload> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded)=> {
            if (err) reject(err);
            resolve(decoded as UserJWTPayload);
        });
    });
}