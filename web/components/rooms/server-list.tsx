import { PlusIcon } from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router";

import { useLastRoomForServerStore } from "~/common/rooms";
import { useServerStore } from "~/common/servers";
import { useCurrentServer } from "~/hooks/server";
import type { Server } from "~/types/server";

import { CreateServerModal } from "./create-server";
import { ServerIcon } from "../ui/avatar";
import { Button } from "../ui/button";

export function ServerList() {
    const servers = useServerStore((store) => store.items);
    const lastRoom = useLastRoomForServerStore();
    const server = useCurrentServer();
    const params = useParams();

    useEffect(
        () => {
            const roomId = Number(params.rid);
            if (!server || !roomId || Number.isNaN(roomId)) return;

            lastRoom.setLastRoom(server.id, roomId);
        },
        [params]
    );

    return (
        <div className="w-15 bg-background2 pb-4 h-full">
            <div className="border-r-1 h-full p-2.5 space-y-2">
                {servers.map((server) =>
                    <Server
                        key={server.id}
                        server={server}
                        lastRoomId={lastRoom[server.id]}
                    />
                )}
                <CreateServer />
            </div>
        </div>
    );
}

function CreateServer() {
    return (
        <CreateServerModal>
            <Button
                variant="server"
                size="icon"
            >
                <PlusIcon className="text-violet-400" />
            </Button>
        </CreateServerModal>
    );
}

function Server({ server, lastRoomId }: { server: Server; lastRoomId: number; }) {
    return (
        <Button
            variant="server"
            size="icon"
            asChild
        >
            <Link to={`/rooms/${server.id}${lastRoomId ? `/${lastRoomId}` : ""}`}>
                <ServerIcon
                    id={server.id}
                    name={server.name}
                />
            </Link>
        </Button>
    );
}