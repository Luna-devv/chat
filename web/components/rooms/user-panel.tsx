import { useCurrentUserStore } from "~/common/users";

import { UserAvatar } from "../ui/avatar";

export function CurrentUserPanel() {
    const currentUser = useCurrentUserStore();

    return (
        <div className="absolute flex items-center gap-2 bg-popover border-2 border-border rounded-lg shadow-xl p-3 z-10 bottom-3 left-3 w-[calc(100%-24px)] break-all">
            <UserAvatar
                className="size-9"
                id={currentUser?.id}
                username={currentUser?.username}
            />
            <div>
                <p className="font-medium">{currentUser?.nickname || currentUser?.username}</p>
                <p className="text-muted-foreground text-xs font-semibold">@{currentUser?.username}</p>
            </div>
        </div>
    );
}