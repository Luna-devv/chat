import { useCallback, useEffect, useState } from "react";

export enum AutocompleteType {
    User = 0,
    Channel = 1
}

export interface Option {
    id: number;
    name: string;
    type: AutocompleteType;
}

interface UseAutocompleteProps {
    options: Option[];
    onSelect: (selected: Option) => void;
}

interface UseAutocompleteReturn {
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    filteredOptions: Option[];
    selectedIndex: number;
    focused: boolean;
}

export function useAutocomplete({
    options,
    onSelect
}: UseAutocompleteProps): UseAutocompleteReturn {
    const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [trigger, setTrigger] = useState<string | null>(null);
    const [focused, setFocused] = useState(false);
    const [search, setSearch] = useState("");

    const onChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const value = e.target.value;
            const cursorPosition = e.target.selectionStart || 0;

            const textBeforeCursor = value.slice(0, cursorPosition);
            const matches = textBeforeCursor.match(/[@#][\w]*$/);

            if (matches) {
                const [matchedText] = matches;
                setTrigger(matchedText[0]);
                setSearch(matchedText.slice(1));
            } else {
                setTrigger(null);
                setSearch("");
            }
        },
        []
    );

    const onKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            if (!trigger || !filteredOptions.length) return;

            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setSelectedIndex((prev) => (prev + 1) % filteredOptions.length);
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setSelectedIndex((prev) => (prev - 1 + filteredOptions.length) % filteredOptions.length);
                    break;
                case "Enter":
                case "Tab":
                    e.preventDefault();
                    onSelect(filteredOptions[selectedIndex]);
                    setTrigger(null);
                    setSearch("");
                    break;
            }
        },
        [trigger, filteredOptions, selectedIndex, onSelect]
    );

    const onFocus = useCallback(
        () => setFocused(true),
        []
    );

    const onBlur = useCallback(
        () => setFocused(false),
        []
    );

    useEffect(
        () => {
            console.log(trigger);
            if (!trigger) {
                setFilteredOptions([]);
                return;
            }

            if (!search) {
                setFilteredOptions(
                    options.filter((option) => (
                        trigger === (option.type === AutocompleteType.Channel ? "#" : "@")
                    ))
                );

                setSelectedIndex(0);
                return;
            }

            setFilteredOptions(options.filter((option) => (
                option.name.toLowerCase().startsWith(search.toLowerCase()) &&
                trigger === (option.type === AutocompleteType.Channel ? "#" : "@")
            )));

            setSelectedIndex(0);
        },
        [trigger, search, options]
    );

    return {
        onChange,
        onKeyDown,
        onFocus,
        onBlur,
        filteredOptions,
        selectedIndex,
        focused
    };
}