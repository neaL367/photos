import Link from "next/link";

export function SiteHeader() {
  return (
    <header
      className="flex items-baseline justify-between gap-6 py-6 sm:py-8"
      style={{ viewTransitionName: "site-header" }}
    >
      <Link
        href="/"
        transitionTypes={["nav-back"]}
        className="text-[17px] tracking-[-0.01em] outline-none focus-visible:underline focus-visible:underline-offset-4"
      >
        Frames
      </Link>
      <a
        href="https://neal367.vercel.app/"
        rel="me"
        aria-label="neal367 — personal website"
        className="text-[10px] uppercase tracking-[0.18em] text-muted outline-none transition-colors hover:text-foreground focus-visible:underline focus-visible:underline-offset-4"
      >
        neal367 ↗
      </a>
    </header>
  );
}
