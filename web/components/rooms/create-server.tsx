import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { ArrowLeftIcon, TriangleAlertIcon } from "lucide-react";
import { type ReactNode, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import { Config } from "~/constants/config";
import { request } from "~/lib/api";
import type { APIPostInviteBody, APIPostInviteResponse } from "~/types/invites";
import { APIPostInviteBodySchema } from "~/types/invites";
import type { APIPostServersBody, APIPostServersResponse } from "~/types/server";
import { APIPostServersBodySchema } from "~/types/server";

import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

enum State {
    JoinServer = 0,
    CreateServer = 1
}

export function CreateServerModal({
    children
}: {
    children: ReactNode;
}) {
    const [state, setState] = useState<State>(State.JoinServer);
    const [open, setOpen] = useState(false);

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) setTimeout(() => setState(State.JoinServer), 800);
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
                {state === State.JoinServer
                    ? <JoinServer
                        onSuccess={() => setOpen(false)}
                        onChange={setState}
                    />
                    : <CreateServer
                        onSuccess={() => setOpen(false)}
                        onBack={() => setState(State.JoinServer)}
                    />
                }
            </DialogContent>
        </Dialog>

    );
}

function JoinServer({
    onSuccess,
    onChange
}: {
    onSuccess: () => unknown;
    onChange: (state: State) => void;
}) {
    const captcha = useRef<TurnstileInstance | null>(null);
    const [invite, setInvite] = useState<string | null>();
    const [error, setError] = useState<string | null>();
    const navigate = useNavigate();

    const form = useForm<APIPostInviteBody>({
        resolver: zodResolver(APIPostInviteBodySchema)
    });

    const captchaKey = form.watch("captcha_key");

    async function handle(data: APIPostInviteBody) {
        const res = await request<APIPostInviteResponse>("post", `/invites/${invite}`, data);
        captcha.current?.reset();
        setError(null);

        if ("message" in res) {
            setError(res.message);
            return;
        }

        void navigate(`/rooms/${res.server_id}/${res.invite_room_id}`);
        onSuccess();
    }

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

            {error &&
                <Alert variant="destructive">
                    <TriangleAlertIcon className="size-5" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            }

            <Form {...form}>
                <form
                    /* eslint-disable-next-line react-compiler/react-compiler */
                    onSubmit={form.handleSubmit(handle)}
                    className="flex gap-2"
                >
                    <div className="w-full">
                        <Label htmlFor="server-invite">Join a Server</Label>
                        <Input
                            id="server-invite"
                            placeholder="0eKQKZis"
                            onChange={(e) => setInvite(e.target.value)}
                        />
                    </div>

                    <Button
                        className="mt-auto w-24"
                        variant="secondary"
                        type="submit"
                        disabled={!invite || !captchaKey}
                    >
                        Join
                    </Button>
                </form>
            </Form>

            {(invite || captchaKey) &&
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
        </div>
    );
}

function CreateServer({
    onSuccess,
    onBack
}: {
    onSuccess: () => unknown;
    onBack: () => unknown;
}) {
    const captcha = useRef<TurnstileInstance | null>(null);
    const navigate = useNavigate();

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

        void navigate(`/rooms/${res.id}`);
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

                <div className="pt-1 flex justify-between items-end">
                    <Button
                        variant="secondary"
                        type="submit"
                        disabled={!name || !captchaKey}
                    >
                        Create Server
                    </Button>
                    <Button
                        variant="link"
                        size="sm"
                        onClick={onBack}
                    >
                        <ArrowLeftIcon />
                        Join server instead
                    </Button>
                </div>
            </form>
        </Form>
    );
}