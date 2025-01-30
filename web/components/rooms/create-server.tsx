import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { type ReactNode, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { Config } from "~/constants/config";
import { request } from "~/lib/api";
import type { APIPostServersBody, APIPostServersResponse } from "~/types/server";
import { APIPostServersBodySchema } from "~/types/server";

import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

enum State {
    Choose = 0,
    CreateServer = 1
}

export function CreateServerModal({
    children
}: {
    children: ReactNode;
}) {
    const [state, setState] = useState<State>(State.Choose);
    const [open, setOpen] = useState(false);

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) setState(State.Choose);
                setOpen(isOpen);
            }}
        >
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create or join a Server</DialogTitle>
                    <DialogDescription>
                        A server is a collection of rooms where you and your friends - or community - can chat and hang out!
                    </DialogDescription>
                </DialogHeader>
                {state === State.Choose
                    ? <Choose onChange={setState} />
                    : <CreateServer onSuccess={() => setOpen(false)} />
                }
            </DialogContent>
        </Dialog>

    );
}

function Choose({
    onChange
}: {
    onChange: (state: State) => void;
}) {
    return (
        <div className="space-y-4">
            <Button
                className="w-full"
                variant="secondary"
                onClick={() => onChange(State.CreateServer)}
            >
                Create a Server
            </Button>

            <Separator />

            <div className="flex gap-2">
                <div className="w-full">
                    <Label htmlFor="server-invite">Join a Server</Label>
                    <Input
                        id="server-invite"
                        placeholder={`${Config.base_url}/i/${Config.platform_name.replace(/ +/, "-").toLowerCase()}`}
                    />
                </div>
                <Button
                    className="mt-auto w-24"
                    variant="secondary"
                >
                    Join
                </Button>
            </div>
        </div>
    );
}

function CreateServer({
    onSuccess
}: {
    onSuccess: () => unknown;
}) {
    const captcha = useRef<TurnstileInstance | null>(null);

    const form = useForm<APIPostServersBody>({
        resolver: zodResolver(APIPostServersBodySchema)
    });

    const name = form.watch("name");
    const captchaKey = form.watch("captcha_key");

    async function handle(data: APIPostServersBody) {
        const res = await request<APIPostServersResponse>("post", "/servers", data);
        captcha.current?.reset();

        if ("message" in res) {
            form.setError("name", { message: res.message });
            return;
        }

        onSuccess();
    }

    return (
        <Form {...form}>
            <form
                /* eslint-disable-next-line react-compiler/react-compiler */
                onSubmit={form.handleSubmit(handle)}
                className="space-y-2"
            >

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Server Name
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="name"
                                    autoFocus
                                    placeholder="Lesbian Dungeon"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {(name || captchaKey) &&
                    <Turnstile
                        className="!mb-2"
                        siteKey={Config.captcha_site_key}
                        options={{
                            size: "flexible",
                            theme: "dark"
                        }}
                        onSuccess={(key) => form.setValue("captcha_key", key)}
                        ref={captcha}
                    />
                }

                <Button
                    className="mt-auto w-24"
                    variant="secondary"
                    type="submit"
                    disabled={!name || !captchaKey}
                >
                    Create Server
                </Button>
            </form>
        </Form>
    );
}