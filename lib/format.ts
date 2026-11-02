const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const TIME_FORMAT = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "UTC",
});

function parse(value?: string) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

/** Formats an ISO timestamp as "14 July 2026". */
export function formatDate(value?: string) {
  const date = parse(value);

  return date ? DATE_FORMAT.format(date) : null;
}

/** Formats an ISO timestamp as "15:48" (UTC). */
export function formatTime(value?: string) {
  const date = parse(value);

  return date ? TIME_FORMAT.format(date) : null;
}

/** Formats an ISO timestamp as "14 July 2026 · 15:48". */
export function formatTimestamp(value?: string) {
  const date = parse(value);

  return date
    ? `${DATE_FORMAT.format(date)} · ${TIME_FORMAT.format(date)}`
    : null;
}
