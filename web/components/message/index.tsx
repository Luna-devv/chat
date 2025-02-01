import { useMemo } from "react";

import { useUserStore } from "~/common/user";
import type { Message } from "~/types/messages";
import { buildPostTimeValues } from "~/utils/datetime";

import { MessageContent } from "./content";
import { DisplayLocalTime } from "../local-time";
import { UserAvatar } from "../ui/avatar";

interface Props extends Omit<Message, "author"> {
    isFirst: boolean;
}

export function Message({ content, created_at, author_id, isFirst }: Props) {
    const createdAt = buildPostTimeValues(new Date(created_at));
    const users = useUserStore((store) => store.items);

    const author = useMemo(
        () => users.find((user) => user.id === author_id),
        [users]
    );

    return (
        <div className={"flex w-full grow-0 flex-col items-stretch justify-start px-5 py-[3px] md:gap-0 group hover:bg-background2"}>
            <div className="flex flex-row">
                <div className="flex w-13.5 shrink-0 items-start justify-start">
                    {isFirst
                        ? <UserAvatar
                            id={author?.id}
                            username={author?.username}
                        />
                        : <time
                            className="hidden ml-2 items-center self-center text-center text-xs opacity-70 group-hover:flex pointer-events-none"
                            dateTime={createdAt.iso}
                            title={createdAt.tooltip}
                        >
                            <DisplayLocalTime short date={createdAt.raw} />
                        </time>
                    }
                </div>

                <div className="w-0 flex-1 -mt-1">
                    {isFirst && (
                        <div className="flex items-center space-x-2 pointer-events-none">
                            <div className="overflow-hidden text-ellipsis whitespace-nowrap font-[450]">
                                <span>{author?.username}</span>
                            </div>
                            <time
                                className="mt-1 text-xs opacity-70"
                                dateTime={createdAt.iso}
                                title={createdAt.tooltip}
                            >
                                <DisplayLocalTime date={createdAt.raw} />
                            </time>
                        </div>
                    )}

                    <MessageContent content={content} />
                </div>
            </div>
        </div>
    );
}