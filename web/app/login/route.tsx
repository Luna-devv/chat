import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { APIPostAuthLoginBodySchema, APIPostAuthLoginResponse, APIPostAuthRegisterBody, APIPostAuthRegisterBodySchema, APIPostAuthRegisterResponse } from "types/auth";
import { Auth, AuthContent, AuthDescription, AuthTitle } from "~/components/auth";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Config } from "~/constants/config";
import { request } from "~/lib/api";

enum Type {
    Login = "login",
    Create = "create"
}

const fields = [
    "email",
    "username",
    "password"
] as const;

export default function Login() {
    const [type, setType] = useState<Type>(Type.Login);

    const form = useForm<APIPostAuthRegisterBody>({
        resolver: zodResolver(
            type === Type.Create
                ? APIPostAuthRegisterBodySchema
                : APIPostAuthLoginBodySchema
        )
    });

    const email = form.watch("email");
    const username = form.watch("username");
    const password = form.watch("password");
    const captchaKey = form.watch("captcha_key");

    const canContinue = email && password && (type === Type.Create ? username : true);

    async function register(data: APIPostAuthRegisterBody) {
        const res = await request<APIPostAuthRegisterResponse>("post", "/auth/register", data);

        if ("message" in res) {
            form.setError("password", { message: res.message });
            return;
        }

        window.location.href = "/app";
    }

    async function login(data: APIPostAuthRegisterBody) {
        const res = await request<APIPostAuthLoginResponse>("post", "/auth/login", data);

        if ("message" in res) {
            form.setError("password", { message: res.message });
            return;
        }

        window.location.href = "/app";
    }

    return (
        <Auth>
            <AuthTitle>👋 Welcome to {Config.platform_name}</AuthTitle>
            <AuthDescription>Tell us who you are to start chatting!</AuthDescription>
                <AuthContent>
                    <Tabs
                        defaultValue={Type.Login}
                        className="w-full mt-5 mb-3"
                        onValueChange={(value) => setType(value as Type)}
                    >
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value={Type.Login}>Login</TabsTrigger>
                            <TabsTrigger value={Type.Create}>Create</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(type === Type.Create ? register : login)}
                            className="space-y-2"
                        >
                            {fields.map((id) =>
                               (type === Type.Login && id === "username") ? null : (
                                <FormField
                                    key={id}
                                    control={form.control}
                                    name={id}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {id.replace(/^\w/, (char) => char.toUpperCase())}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type={id}
                                                    autoComplete={id === "password"
                                                        ? (type === Type.Login ? "current-password" : "new-password")
                                                        : id
                                                    }
                                                    autoFocus={id === "email"}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                            <div className="h-2" />

                            {(canContinue || captchaKey) &&
                                <Turnstile
                                    className="!mb-2"
                                    siteKey={Config.captcha_site_key}
                                    options={{
                                        size: "flexible",
                                        theme: "dark"
                                    }}
                                    onSuccess={(key) => form.setValue("captcha_key", key)}
                                />
                            }

                            <Button
                                className="w-full"
                                type="submit"
                                disabled={!canContinue || !captchaKey}
                            >
                                Submit
                            </Button>
                        </form>
                    </Form>
                </AuthContent>
        </Auth>
    );
}