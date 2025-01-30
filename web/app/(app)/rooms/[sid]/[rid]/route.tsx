import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";

import { useCurrentRoomMessages } from "~/common/message";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { request } from "~/lib/api";
import type { APIPostRoomMessagesBody, APIPostRoomMessagesResponse } from "~/types/messages";
import { APIPostRoomMessagesBodySchema } from "~/types/messages";

export default function Room() {
    const messages = useCurrentRoomMessages();
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
        <div>
            {JSON.stringify(messages)}

            <Form {...form}>
                <form

                    onSubmit={form.handleSubmit(handle)}
                    className="space-y-2"
                >
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Room Name
                                </FormLabel>
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
                        className="mt-auto"
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