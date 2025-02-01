import { useState } from "react";

import { cn } from "~/lib/utils";

import { AutocompleteType, type Option } from "./hook";

interface AutoCompleteProps {
    options: Option[];
    selectedIndex: number;
    onSelect: (option: Option) => void;
}

export function AutoComplete({
    options,
    selectedIndex,
    onSelect
}: AutoCompleteProps) {
    const [hover, setHover] = useState(false);

    if (options.length === 0) return null;

    return (
        <div className="relative">
            <ul className="absolute z-50 bottom-3 w-full bg-background2 border rounded-lg overflow-hidden">
                {options.map((option, index) => (
                    <li
                        key={option.id}
                        className={cn(
                            "px-4 py-2 cursor-pointer first:pt-3 last:pb-3 hover:bg-border/50",
                            index === selectedIndex && !hover && "bg-border/50"
                        )}
                        onClick={() => onSelect(option)}
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                    >
                        {option.type === AutocompleteType.Channel ? `#${option.name}` : `@${option.name}`}
                    </li>
                ))}
            </ul>
        </div>
    );
}