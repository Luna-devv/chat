import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactNode } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useCurrentServer } from "~/common/servers";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { request } from "~/lib/api";
import { type APIPostServerRoomsBody, APIPostServerRoomsBodySchema, type APIPostServerRoomsResponse, RoomType } from "~/types/rooms";

export function CreateRoomModal({
    children
}: {
    children: ReactNode;
}) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => setOpen(isOpen)}
        >
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new Room</DialogTitle>
                </DialogHeader>
                <CreateRoom onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>

    );
}

function CreateRoom({
    onSuccess
}: {
    onSuccess: () => unknown;
}) {
    const server = useCurrentServer()!;

    const form = useForm<APIPostServerRoomsBody>({
        resolver: zodResolver(APIPostServerRoomsBodySchema),
        defaultValues: {
            type: RoomType.ServerText,
            parent_room_id: null
        }
    });

    const name = form.watch("name");

    async function handle(data: APIPostServerRoomsBody) {
        const res = await request<APIPostServerRoomsResponse>("post", `/servers/${server.id}/rooms`, data);

        if ("message" in res) {
            form.setError("name", { message: res.message });
            return;
        }

        onSuccess();
    }

    return (
        <Form {...form}>
            <form

                onSubmit={form.handleSubmit(handle)}
                className="space-y-2"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Room Name
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="name"
                                    autoFocus
                                    placeholder="lounge"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    className="mt-1"
                    variant="secondary"
                    type="submit"
                    disabled={!name}
                >
                    Create Room
                </Button>
            </form>
        </Form>
    );
}