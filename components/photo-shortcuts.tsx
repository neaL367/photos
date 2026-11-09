"use client";

import { useEffect } from "react";

/**
 * Left and right arrows step through the archive, mirroring the previous and
 * next links at the foot of a photograph.
 */
export function PhotoShortcuts() {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.shiftKey
      ) {
        return;
      }

      const direction =
        event.key === "ArrowLeft"
          ? "previous"
          : event.key === "ArrowRight"
            ? "next"
            : null;

      if (!direction) {
        return;
      }

      const target = event.target as HTMLElement | null;

      if (target?.closest("input, textarea, select, [contenteditable='true']")) {
        return;
      }

      // Pages kept alive by <Activity> stay in the document, hidden. Pick the
      // link on the page that is actually on screen.
      const link = Array.from(
        document.querySelectorAll<HTMLAnchorElement>(
          `[data-photo-nav="${direction}"]`,
        ),
      ).find((element) => element.offsetParent !== null);

      if (!link) {
        return;
      }

      event.preventDefault();
      link.click();
    }

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return null;
}
