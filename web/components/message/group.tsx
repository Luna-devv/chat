import type { GroupedMessages } from "~/utils/group-messages";

import { Message } from ".";

export function MessageGroup({ messages }: GroupedMessages) {
    return (
        <div>
            {messages.map((message, i) => (
                <Message
                    key={"m-" + message.id}
                    isFirst={i === 0}
                    {...message}
                />
            ))}
        </div>
    );
}