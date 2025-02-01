// https://www.slatejs.org/examples/mentions
// https://github.com/ianstormtaylor/slate/blob/main/site/examples/ts/mentions.tsx
// ... to complicated,,

import { useMemo, useState } from "react";
import { useParams } from "react-router";

import { request } from "~/lib/api";
import type { APIPostRoomMessagesResponse } from "~/types/messages";

import { TextareaAutosize } from "../ui/textarea-autosize";

export function MessageInput() {
    const [inputValue, setInputValue] = useState<string>("");
    const params = useParams();
    return (
        <div>
            <TextareaAutosize
                value={inputValue}
                placeholder="Type your message..."
                onChange={(e) => {
                    setInputValue(e.target.value);
                }}
                onKeyDown={(e) => {
                    if (e.key !== "Enter" || e.shiftKey) return;
                    e.preventDefault();

                    const message = request<APIPostRoomMessagesResponse>(
                        "post",
                        `/rooms/${params.rid}/messages`,
                        { content: inputValue }
                    );
                    if ("message" in message) return; // TODO: error?
                }}
            />
        </div>
    );
}