import { cn } from "~/lib/utils";

import { AutocompleteType, type Option } from "./hook";

interface AutoCompleteProps {
    options: Option[];
    selectedIndex: number;
    onSelect: (option: Option) => void;
    setWithin: React.Dispatch<React.SetStateAction<boolean>>;
    within: boolean;
}

export function AutoComplete({
    options,
    selectedIndex,
    onSelect,
    setWithin,
    within
}: AutoCompleteProps) {
    if (options.length === 0) return null;

    return (
        <div
            className="relative"
            onMouseEnter={() => setWithin(true)}
            onMouseLeave={() => setWithin(false)}
        >
            <ul className="absolute z-50 bottom-3 w-full bg-background2 border rounded-lg overflow-hidden">
                {options.map((option, index) => (
                    <li
                        key={option.id}
                        className={cn(
                            "px-4 py-2 cursor-pointer first:pt-3 last:pb-3 hover:bg-border/50",
                            index === selectedIndex && !within && "bg-border/50"
                        )}
                        onClick={() => onSelect(option)}
                    >
                        {option.type === AutocompleteType.Channel ? `#${option.name}` : `@${option.name}`}
                    </li>
                ))}
            </ul>
        </div>
    );
}