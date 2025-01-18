import { Config } from "~/constants/config";

const API_CLOUDFLARE_TURNSILE_SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify" as const;

interface CloudflareTurnsileSiteverifyResponse {
    success: boolean;
    "error-codes": string[];
}

export async function verifyCaptchaKey(key: string, ip: string) {
    const formData = new FormData();
    formData.append("secret", Config.captcha_secret);
    formData.append("response", key);
    formData.append("remoteip", ip);

    const result = await fetch(API_CLOUDFLARE_TURNSILE_SITEVERIFY, {
        body: formData,
        method: "POST"
    })
        .then((r) => r.json())
        .catch(() => null) as CloudflareTurnsileSiteverifyResponse | null;

    if (!result) return null;
    return result.success;
}