import jwt from "jsonwebtoken";
import { createHash } from "node:crypto";

import type { UserEmailVerifyJWTPayload, UserJWTPayload } from "~/types/users";

const secret = createHash("sha256")
    .update(process.env.SECRET!)
    .digest("hex");

class JWTManager<T extends object> {
    constructor(
        private secret: string,
        private expiresIn: string
    ) {}

    sign(data: T) {
        return jwt.sign(data, this.secret, { expiresIn: this.expiresIn });
    }

    async verify(token: string): Promise<T> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.secret, (err, decoded) => {
                if (err) reject(err);
                resolve(decoded as T);
            });
        });
    }
}

export const session = new JWTManager<UserJWTPayload>(secret + "session", "365d");
export const verifyemail = new JWTManager<UserEmailVerifyJWTPayload>(secret + "verifyemail", "1d");