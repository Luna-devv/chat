import React, { useEffect, useImperativeHandle, useRef, useState } from "react";

import { cn } from "~/lib/utils";

import { Textarea } from "./textarea";

const MAX_ROWS = 10 as const;
const LINE_HEIGHT = 32 as const;

const TextareaAutosize = React.forwardRef<
    HTMLTextAreaElement,
    React.ComponentProps<"textarea">
>(({ className, onChange, onKeyDown, style, ...props }, ref) => {
    const [value, setValue] = useState<string>("");
    const [rows, setRows] = useState<number>(1);
    const textarea = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => textarea.current!);

    function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
        onChange?.(e);

        const textarea = e.currentTarget;
        setValue(textarea.value);

        if (!textarea.value.length) {
            setRows(1);
            return;
        }

        const previousRows = textarea.rows;
        textarea.rows = 1;

        const currentRows = Math.max(Math.floor(textarea.scrollHeight / LINE_HEIGHT) - 1, 1);
        if (currentRows === previousRows) {
            textarea.rows = currentRows;
        }

        if (currentRows >= MAX_ROWS) {
            textarea.rows = MAX_ROWS;
            textarea.scrollTop = textarea.scrollHeight;
        }

        setRows(Math.min(currentRows, MAX_ROWS));
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        onKeyDown?.(e);

        if (e.key !== "Enter" || !e.shiftKey) return;
        console.log("EEE");
        setValue("");
        setRows(1);
    }

    useEffect(
        () => {
            if (!textarea.current) return;
            textarea.current.style.height = "auto";
            textarea.current.style.height = `${textarea.current.scrollHeight + 3}px`;
        },
        [value]
    );

    return (
        <Textarea
            ref={textarea}
            rows={rows}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            className={cn("p-3 resize-none", className)}
            style={{
                maxHeight: `${MAX_ROWS * LINE_HEIGHT}px`,
                ...style
            }}
            {...props}
        />
    );
});
TextareaAutosize.displayName = "TextareaAutosize";

export { TextareaAutosize };