import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";

import { MessageInput } from "~/components/rooms/message-input";
import { MessageView } from "~/components/rooms/message-view";
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
        <div className="flex flex-col h-screen w-full p-3">
            <MessageView />

            <MessageInput />
        </div>
    );
}