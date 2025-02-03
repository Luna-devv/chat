import { useCurrentServer } from "~/common/servers";

export function RoomServerHeader() {
    const server = useCurrentServer();

    if (!server) return null;

    return (
        <div className="bg-border p-3 font-medium text-sm">
            {server.name}
        </div>
    );
}