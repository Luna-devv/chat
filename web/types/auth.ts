import { z } from "zod";

import { Config } from "~/constants/config";

export const APIPostAuthRegisterBodySchema = z.object({
    email: z.string().email().max(64).transform((str) => str.toLowerCase()),
    username: z.string().regex(Config.username_constraint),
    password: z.string().regex(Config.password_constraint),
    captcha_key: z.string()
});

export enum UserAuthRequiredAction {
    VerifyEmail = 0
}

// POST /auth/register
export type APIPostAuthRegisterBody = z.infer<typeof APIPostAuthRegisterBodySchema>;
export interface APIPostAuthRegisterResponse {
    required_actions: UserAuthRequiredAction[];
}

// POST /auth/login
export const APIPostAuthLoginBodySchema = z.object({
    email: z.string().email().max(64).transform((str) => str.toLowerCase()),
    password: z.string(), // no constraint in case it gets updated, would break login for old users
    captcha_key: z.string()
});

export type APIPostAuthLoginBody = z.infer<typeof APIPostAuthLoginBodySchema>;
export type APIPostAuthLoginResponse = APIPostAuthRegisterResponse;