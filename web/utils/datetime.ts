const formatter = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric"
});

const shortFormatter = new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "numeric"
});

const tooltipFormatter = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short"
});

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric"
});

export const buildPostTimeValues = (createdAt: Date) => {
    return {
        text: formatter.format(createdAt), // 17 Sep 2023 at 15:20
        shortText: shortFormatter.format(createdAt), // 15:20
        tooltip: tooltipFormatter.format(createdAt), // 17 September 2023 at 15:20:38 GMT+7
        date: dateFormatter.format(createdAt), // 17 September 2023
        iso: createdAt.toISOString(), // 2023-09-17T15:20:38.000Z
        raw: createdAt
    };
};