import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";

import { MessageView } from "~/components/rooms/message-view";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { request } from "~/lib/api";
import type { APIPostRoomMessagesBody, APIPostRoomMessagesResponse } from "~/types/messages";
import { APIPostRoomMessagesBodySchema } from "~/types/messages";

export default function Room() {
    const params = useParams();

    const form = useForm<APIPostRoomMessagesBody>({
        resolver: zodResolver(APIPostRoomMessagesBodySchema)
    });

    async function handle(data: APIPostRoomMessagesBody) {
        const res = await request<APIPostRoomMessagesResponse>("post", `/rooms/${params.rid}/messages`, data);

        if ("message" in res) {
            form.setError("content", { message: res.message });
            return;
        }
    }

    return (
        <div className="flex flex-col h-screen w-full">
            <MessageView />

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handle)}
                    className="flex gap-2 m-4 w-full"
                >
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <Input
                                        type="content"
                                        autoFocus
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        variant="secondary"
                        type="submit"
                    >
                        Send
                    </Button>
                </form>
            </Form>

        </div>
    );
}