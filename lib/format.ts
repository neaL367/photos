const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** Formats an ISO timestamp as "14 July 2026". */
export function formatDate(value?: string) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : DATE_FORMAT.format(date);
}
