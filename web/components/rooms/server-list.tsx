import { PlusIcon } from "lucide-react";

import { Button } from "../ui/button";

export function ServerList() {
    return (
        <div className="bg-background2 pb-4 h-full">
            <div className="border-r-1 h-full p-2.5">
                <CreateServer />
            </div>
        </div>
    );
}

function CreateServer() {
    return (
        <Button
            variant="server"
            size="icon"
        >
            <PlusIcon />
        </Button>
    );
}