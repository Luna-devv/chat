import { Resend } from "resend";

import { Config } from "~/constants/config";

const resend = new Resend(process.env.RESEND_API_SECRET);

export function sendEmailVerificationEmail({
    to,
    username,
    token
}: {
    to: string;
    username: string;
    token: string;
}) {
    return resend.emails.send({
        from: `${Config.platform_name} <onboarding@${Config.email_domain}>`,
        to,
        subject: "Verify your email address",
        html: `<strong>Welcome to ${Config.platform_name}, ${username}!</strong><br /><br />Please verify your email to start using your account with the following link:<br />${Config.base_url}/verify-email#${token}`
    });
}