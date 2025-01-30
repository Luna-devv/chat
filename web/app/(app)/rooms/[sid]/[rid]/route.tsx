import { useServerStore } from "~/common/servers";

export default function Room() {
    const servers = useServerStore((store) => store.servers);

    return (
        <div>
            {JSON.stringify(servers)}
        </div>
    );
}