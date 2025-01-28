import { Outlet } from "react-router";

import { RoomList } from "~/components/rooms/room-list";
import { ServerList } from "~/components/rooms/server-list";
import { CurrentUserPanel } from "~/components/rooms/user-panel";

export default function RoomLayout() {
    return (
        <div className="flex h-screen">
            <div className="flex relative">
                <ServerList />
                <RoomList />
                <CurrentUserPanel />
            </div>
            <div>
                <Outlet />
            </div>
        </div>
    );
}