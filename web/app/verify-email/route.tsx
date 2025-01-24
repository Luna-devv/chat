import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { TriangleAlertIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SiGmail, SiProtonmail } from "react-icons/si";
import { Link, useLocation, useNavigate } from "react-router";

import { Auth, AuthContent, AuthDescription, AuthTitle } from "~/components/auth";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { Config } from "~/constants/config";
import { request } from "~/lib/api";
import type { APIPostCurrentUserEmailVerifyBody, APIPostCurrentUserEmailVerifyResponse } from "~/types/users";
import { APIPostCurrentUserEmailVerifyBodySchema } from "~/types/users";

export default function VerifyEmail() {
    const { hash } = useLocation();

    return (
        <Auth>
            <AuthTitle>Verify your email</AuthTitle>
            {hash.length > 1
                ? <Complete hash={hash} />
                : <OpenEmails />
            }
        </Auth>
    );
}

function OpenEmails() {
    return (<>
        <AuthDescription>Open your email client to verify your email!</AuthDescription>

        <div className="flex gap-4 mt-4">
            <Button
                asChild
                className="w-1/2"
                variant="secondary"
            >
                <Link to="https://gmail.com">
                    <SiGmail />
                    Gmail
                </Link>
            </Button>
            <Button
                asChild
                className="w-1/2"
                variant="secondary"
            >
                <Link to="https://mail.proton.me">
                    <SiProtonmail />
                    Proton Mail
                </Link>
            </Button>
        </div>
    </>);
}

function Complete({ hash }: { hash: string; }) {
    const [error, setError] = useState<string>();
    const navigate = useNavigate();

    const form = useForm<APIPostCurrentUserEmailVerifyBody>({
        resolver: zodResolver(APIPostCurrentUserEmailVerifyBodySchema)
    });

    useEffect(() => {
        if (!hash) return;
        form.setValue("token", hash.slice(1));
    }, [hash]);

    const captchaKey = form.watch("captcha_key");

    async function verify(data: APIPostCurrentUserEmailVerifyBody) {
        const res = await request<APIPostCurrentUserEmailVerifyResponse>("post", "/users/@me/email/verify", data);

        if (res && "message" in res) {
            setError(res.message);
            return;
        }

        void navigate("/app");
    }

    return (<>
        <AuthDescription>Verify your email to start using your account!</AuthDescription>
        <AuthContent>

            {error &&
                    <Alert variant="destructive">
                        <TriangleAlertIcon className="size-5" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
            }

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(verify)}
                    className="space-y-2"
                >
                    <Turnstile
                        className="!mb-2"
                        siteKey={Config.captcha_site_key}
                        options={{
                            size: "flexible",
                            theme: "dark"
                        }}
                        onSuccess={(key) => form.setValue("captcha_key", key)}
                    />

                    <Button
                        className="w-full"
                        type="submit"
                        disabled={!hash || !captchaKey}
                    >
                        Create Account & Continue
                    </Button>
                </form>
            </Form>

        </AuthContent>
    </>);
}