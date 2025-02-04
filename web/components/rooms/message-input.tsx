// https://www.slatejs.org/examples/mentions
// https://github.com/ianstormtaylor/slate/blob/main/site/examples/ts/mentions.tsx
// ... to complicated,,

import { useMemo, useRef, useState } from "react";
import { useParams } from "react-router";

import { request } from "~/lib/api";
import type { APIPostRoomMessagesResponse } from "~/types/messages";

import { AutoComplete } from "../autocomplete";
import type { Option } from "../autocomplete/hook";
import { AutocompleteType, useAutocomplete } from "../autocomplete/hook";
import { TextareaAutosize } from "../ui/textarea-autosize";

export function MessageInput() {
    const [inputValue, setInputValue] = useState<string>("");
    const textarea = useRef<HTMLTextAreaElement | null>(null);
    const params = useParams();

    const options = useMemo(() => [
        { id: 1, name: "luna", type: AutocompleteType.User },
        { id: 2, name: "sol", type: AutocompleteType.User },
        { id: 3, name: "general", type: AutocompleteType.Channel },
        { id: 4, name: "random", type: AutocompleteType.Channel }
    ], []);

    const { filteredOptions, focused, onChange, onKeyDown, onSelect, ...props } = useAutocomplete({
        options,
        handleSelect
    });

    function handleSelect(selected: Option, cursor: number) {
        const prefix = selected.type === AutocompleteType.Channel ? "#" : "@";
        textarea.current?.focus();

        setInputValue((prev) => {
            const mentionRegex = /[@#][\w]*/g;
            let match;
            let closestMatch: RegExpExecArray | null = null;

            while ((match = mentionRegex.exec(prev)) !== null) {
                const start = match.index;
                const end = start + match[0].length;

                if (start <= cursor && cursor <= end) {
                    closestMatch = match;
                    break;
                }
            }

            if (!closestMatch) return prev;

            const before = prev.slice(0, closestMatch.index);
            const replacement = `${prefix}${selected.name} `;
            const after = prev.slice(closestMatch.index + closestMatch[0].length);

            const newCursor = before.length + replacement.length;

            // Update cursor position after re-render
            setTimeout(() => {
                textarea.current?.setSelectionRange(newCursor, newCursor);
            }, 0);

            return before + replacement + after;
        });
    }

    return (
        <div className="m-3">
            {focused &&
                <AutoComplete
                    options={filteredOptions}
                    onSelect={onSelect}
                    {...props}
                />
            }
            <TextareaAutosize
                ref={textarea}
                value={inputValue}
                placeholder="Type your message..."
                onChange={(e) => {
                    onChange(e);
                    setInputValue(e.target.value);
                }}
                onKeyDown={(e) => {
                    onKeyDown(e);

                    if (e.key !== "Enter" || e.shiftKey || filteredOptions.length || !focus) return;
                    e.preventDefault();

                    const message = request<APIPostRoomMessagesResponse>(
                        "post",
                        `/rooms/${params.rid}/messages`,
                        { content: inputValue }
                    );

                    if ("message" in message) return; // TODO: error?
                    setInputValue("");
                }}
                {...props}
            />
        </div>
    );
}