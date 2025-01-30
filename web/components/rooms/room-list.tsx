import { HashIcon, PlusIcon } from "lucide-react";
import { Link, useParams } from "react-router";

import { useCurrentServer, useCurrentServerRooms } from "~/common/servers";
import { useCurrentUserStore } from "~/common/users";

import { CreateRoomModal } from "./create-room";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export function RoomList() {
    const server = useCurrentServer();
    const rooms = useCurrentServerRooms();
    const currentUser = useCurrentUserStore();
    const params = useParams();

    if (!server) {
        return <div className="w-56 bg-background2" />;
        // redirect("/rooms/@me");
    }

    return (
        <div className="w-56 bg-background2">
            <div className="bg-border p-3 font-medium text-sm">
                {server.name}
            </div>

            <div className="p-2.5 space-y-px">
                {rooms
                    .sort((a, b) => b.position - a.position)
                    .map((room) =>
                        <Button
                            key={room.id}
                            asChild
                            variant="room"
                            data-selected={Number(params.rid) === room.id}
                        >
                            <Link to={`/rooms/${server.id}/${room.id}`}>
                                <HashIcon />
                                {room.name}
                            </Link>
                        </Button>
                    )
                }

                <Separator className="mt-2" />

                {server.owner_id === currentUser?.id &&
                    <CreateRoomModal>
                        <Button
                            className="text-xs text-muted-foreground mx-2"
                            variant="link"
                        >
                            <PlusIcon />
                            Create new room
                        </Button>
                    </CreateRoomModal>
                }
            </div>
        </div>
    );
}