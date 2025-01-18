import type { ColumnType, Generated, Selectable } from "kysely";
import { z } from "zod";

import { Config } from "~/constants/config";

export interface UserTable {
    id: Generated<number>;

    email: string;
    password_hash: string;

    username: string;
    nickname: string | null;

    flags: Generated<number>;

    created_at: ColumnType<Date, string | undefined, never>;
}

export type User = Selectable<UserTable>;
export type UserJWTPayload = Pick<User, "id">;

export enum UserFlags {
    VerifiedEmail = 1 << 0,
    Disabled = 1 << 1,
    System = 1 << 2,
    Bot = 1 << 3,

    HasAvatar = 1 << 4,
    HasBanner = 1 << 5,

    Staff = 1 << 6
}

export const APIPostUserBodySchema = z.object({
    email: z.string().email().max(64),
    username: z.string().regex(Config.username_constraint),
    password: z.string().regex(Config.password_constraint),

    captcha_key: z.string().min(16).max(64)
});

export type APIPostUserBody = z.infer<typeof APIPostUserBodySchema>;