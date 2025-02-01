import { MessageInput } from "~/components/rooms/message-input";
import { MessageView } from "~/components/rooms/message-view";

export default function Room() {
    return (
        <div className="flex flex-col h-screen w-full p-3">
            <MessageView />
            <MessageInput />
        </div>
    );
}