"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

import {
  readHomeScroll,
  rememberHomeExit,
  takeHomeReturn,
} from "@/lib/home-scroll";

// Layout effects do not run while server rendering.
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Keeps the home grid where the visitor left it when they come back from a
 * photograph.
 *
 * The "Frames" link is a push navigation, so the browser does not restore the
 * offset, and pages kept alive by <Activity> keep whatever offset the photo
 * page was at. This records the grid offset while home is visible and scrolls
 * back to it as soon as the grid is shown again — in a layout effect, so the
 * restored position belongs to the navigation's first painted frame (and to the
 * shared-element transition that morphs the thumbnail back into place).
 */
export function HomeScrollMemory() {
  const lastOffset = useRef(0);

  useIsomorphicLayoutEffect(() => {
    const returning = takeHomeReturn();
    const saved = readHomeScroll();

    if (returning) {
      // Coming back from a photograph: land where the grid was left.
      scrollToOffset(saved ?? 0);
    } else if (!isHistoryRestore()) {
      // A fresh mount reached from another page (for example a direct link to
      // a photo page that had been scrolled) should still start at the top.
      scrollToOffset(0);
    }

    lastOffset.current = Math.round(window.scrollY);

    const onScroll = () => {
      lastOffset.current = Math.round(window.scrollY);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);

      // The grid is being hidden or unmounted: remember the offset so the next
      // visit can restore it.
      rememberHomeExit(lastOffset.current);
    };
  }, []);

  return null;
}

function scrollToOffset(offset: number) {
  if (Math.round(window.scrollY) === offset) {
    return;
  }

  window.scrollTo({ top: offset, left: 0, behavior: "instant" });
}

/**
 * Browsers restore the offset themselves for reloads and history traversals
 * that recreate the document. Do not fight that restoration.
 */
function isHistoryRestore() {
  const [navigation] = performance.getEntriesByType(
    "navigation",
  ) as PerformanceNavigationTiming[];

  return navigation?.type === "reload" || navigation?.type === "back_forward";
}
