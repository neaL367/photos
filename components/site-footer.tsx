import { Suspense } from "react";
import { connection } from "next/server";

async function RenderedAt() {
  // The rest of the page is a static shell; this timestamp streams in as a
  // PPR hole on each request.
  await connection();

  const now = new Date();
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(now);

  return <time dateTime={now.toISOString()}>{time}</time>;
}

export function SiteFooter() {
  return (
    <footer className="flex justify-end border-t border-line py-6 text-[10px] uppercase tracking-[0.16em] text-muted">
      <p className="flex items-baseline gap-2">
        <span>Rendered</span>
        <Suspense fallback={<span aria-hidden="true">—</span>}>
          <RenderedAt />
        </Suspense>
      </p>
    </footer>
  );
}
