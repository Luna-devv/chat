// https://www.slatejs.org/examples/mentions
// https://github.com/ianstormtaylor/slate/blob/main/site/examples/ts/mentions.tsx
// ... to complicated,,

import { useMemo, useState } from "react";
import { useParams } from "react-router";

import { request } from "~/lib/api";
import type { APIPostRoomMessagesResponse } from "~/types/messages";

import { AutoComplete } from "../autocomplete";
import type { Option } from "../autocomplete/hook";
import { AutocompleteType, useAutocomplete } from "../autocomplete/hook";
import { TextareaAutosize } from "../ui/textarea-autosize";

export function MessageInput() {
    const [inputValue, setInputValue] = useState<string>("");
    const params = useParams();

    const options = useMemo(() => [
        { id: 1, name: "luna", type: AutocompleteType.User },
        { id: 2, name: "sol", type: AutocompleteType.User },
        { id: 3, name: "general", type: AutocompleteType.Channel },
        { id: 4, name: "random", type: AutocompleteType.Channel }
    ], []);

    // TODO: fix
    // https://discord.com/channels/828676951023550495/939999913406787654/1335260859710312549
    function handleSelect(selected: Option) {
        const prefix = selected.type === AutocompleteType.Channel ? "#" : "@";
        setInputValue((prev) => prev.replace(/[@#][\w]*$/, `${prefix}${selected.name}`));
    }

    const { onChange, filteredOptions, selectedIndex, focused, onKeyDown, ...props } = useAutocomplete({
        options,
        onSelect: handleSelect
    });

    return (
        <div>
            {focused &&
                <AutoComplete
                    options={filteredOptions}
                    selectedIndex={selectedIndex}
                    onSelect={handleSelect}
                />
            }
            <TextareaAutosize
                value={inputValue}
                placeholder="Type your message..."
                onChange={(e) => {
                    onChange(e);
                    setInputValue(e.target.value);
                }}
                onKeyDown={(e) => {
                    onKeyDown(e);

                    if (e.key !== "Enter" || e.shiftKey) return;
                    e.preventDefault();

                    const message = request<APIPostRoomMessagesResponse>(
                        "post",
                        `/rooms/${params.rid}/messages`,
                        { content: inputValue }
                    );
                    if ("message" in message) return; // TODO: error?
                }}
                {...props}
            />
        </div>
    );
}