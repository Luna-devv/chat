import { create } from "zustand";

interface ObjectWithId {
    id: number;
}

interface Props<T extends ObjectWithId> {
    items: T[];

    set: (items: T[]) => void;
    add: (...item: T[]) => void;
    remove: (itemId: number) => void;
}

export function defineDataStore<T extends ObjectWithId>() {
    return create<Props<T>>((set) => ({
        items: [],

        set: (items: T[]) => {
            set(() => ({
                items
            }));
        },
        add: (...items: T[]) => {
            set((state) => ({
                items: [
                    ...state.items.filter((i) => !items.some((item) => i.id === item.id)),
                    ...items
                ]
            }));
        },
        remove: (itemId: number) => {
            set((state) =>({
                items: state.items.filter((i) => i.id !== itemId)
            }));
        }
    }));
}