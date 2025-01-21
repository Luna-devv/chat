import { z } from "zod";

import { Config } from "~/constants/config";

import type { User } from "./users";

export const APIPostAuthRegisterBodySchema = z.object({
    email: z.string().email().max(64).transform((str) => str.toLowerCase()),
    username: z.string().regex(Config.username_constraint),
    password: z.string().regex(Config.password_constraint),
    captcha_key: z.string()
});

export type APIPostAuthRegisterBody = z.infer<typeof APIPostAuthRegisterBodySchema>;
export type APIPostAuthRegisterResponse = Pick<User, "id">;

export const APIPostAuthLoginBodySchema = z.object({
    email: z.string().email().max(64).transform((str) => str.toLowerCase()),
    password: z.string(), // no constraint in case it gets updated, would break login for old users
    captcha_key: z.string()
});

export type ApiPostAuthLoginBody = z.infer<typeof APIPostAuthLoginBodySchema>;
export type APIPostAuthLoginResponse = Pick<User, "id">;