import { PlusIcon } from "lucide-react";
import { Link } from "react-router";

import { useServerStore } from "~/common/servers";
import type { Server } from "~/types/server";

import { CreateServerModal } from "./create-server";
import { ServerIcon } from "../ui/avatar";
import { Button } from "../ui/button";

export function ServerList() {
    const servers = useServerStore((store) => store.items);

    return (
        <div className="w-15 bg-background2 pb-4 h-full">
            <div className="border-r-1 h-full p-2.5 space-y-2">
                {servers.map((server) =>
                    <Server
                        key={server.id}
                        server={server}
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

function Server({ server }: { server: Server; }) {
    return (
        <Button
            variant="server"
            size="icon"
            asChild
        >
            <Link to={`/rooms/${server.id}`}>
                <ServerIcon
                    id={server.id}
                    name={server.name}
                />
            </Link>
        </Button>
    );
}