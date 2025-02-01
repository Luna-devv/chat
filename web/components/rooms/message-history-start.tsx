import { HashIcon } from "lucide-react";

import { useCurrenRoom } from "~/common/rooms";

import { Separator } from "../ui/separator";

export function MessageHistoryStart() {
    const room = useCurrenRoom();

    return (
        <div className="p-5 pb-3">
            <div className="text-2xl font-bold text-white">
                <HashIcon className="inline mb-1" strokeWidth={2.8} />
                {room?.name}
            </div>
            <span className="text-muted-foreground">
                This is the beginning of this room.
            </span>
            <Separator className="mt-4" />
        </div>
    );
}