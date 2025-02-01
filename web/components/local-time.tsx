import { buildPostTimeValues } from "~/utils/datetime";

export function DisplayLocalTime({
    short,
    date
}: {
    short?: boolean;
    date: Date;
}) {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const time = buildPostTimeValues(date);
    const todayTime = buildPostTimeValues(today);
    const yesterdayTime = buildPostTimeValues(yesterday);

    if (!time) {
        return <span className="invisible">{date.toISOString()}</span>;
    }

    // Is Today
    if (time.date === todayTime?.date) {
        return `Today at ${time.shortText}`;
    }

    // Is Yesterday
    if (time.date === yesterdayTime?.date) {
        return `Yesterday at ${time.shortText}`;
    }

    return short ? time.shortText : time.text;
}