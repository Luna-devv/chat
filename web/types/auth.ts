import { z } from "zod";

import { Config } from "~/constants/config";

export const APIPostAuthRegisterBodySchema = z.object({
    email: z.string().email().max(64),
    username: z.string().regex(Config.username_constraint),
    password: z.string().regex(Config.password_constraint),
    captcha_key: z.string()
});

export type APIPostAuthRegisterBody = z.infer<typeof APIPostAuthRegisterBodySchema>;