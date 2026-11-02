import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col justify-center pb-20">
      <h1 className="text-[clamp(2.5rem,6vw,4rem)] leading-[0.98] tracking-[-0.02em]">
        Not found.
      </h1>
      <Link
        href="/"
        transitionTypes={["nav-back"]}
        className="mt-8 w-fit text-[13px] text-muted underline decoration-line underline-offset-4 outline-none transition-colors hover:text-foreground focus-visible:underline"
      >
        ← Index
      </Link>
    </div>
  );
}
