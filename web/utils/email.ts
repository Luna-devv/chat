import { Resend } from "resend";

import { Config } from "~/constants/config";

import { redis } from "./emit-event";

const resend = new Resend(process.env.RESEND_API_SECRET);

export async function sendEmailVerificationEmail({
    to,
    username,
    token
}: {
    to: string;
    username: string;
    token: string;
}) {
    const key = "verification-email:" + to;
    if (await redis.exists(key)) return;

    const mail = await resend.emails.send({
        from: `${Config.platform_name} <onboarding@${Config.email_domain}>`,
        to,
        subject: "Verify your email address",
        html: `<strong>Welcome to ${Config.platform_name}, ${username}!</strong><br /><br />Please verify your email to start using your account with the following link:<br />${Config.base_url}/verify-email#${token}`
    });

    if (!mail.error) return mail.error;

    void redis.set(key, "1", "EX", 60);
    return mail.data?.id;
}