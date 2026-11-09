/**
 * Remembers where the photograph grid was scrolled to.
 *
 * Next.js restores the offset for history navigations, but the "Frames" title
 * is a push navigation and pages kept alive by Cache Components keep the
 * previous document offset. The grid position is therefore kept in
 * sessionStorage (per tab) so the home page can put the visitor back where they
 * left off.
 */

const POSITION_KEY = "frames:home-scroll";
const RETURNING_KEY = "frames:home-scroll-returning";

function session(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    // Storage can be unavailable, e.g. when blocked by browser settings.
    return null;
  }
}

/** The last known offset of the home grid, if it was visited in this tab. */
export function readHomeScroll(): number | null {
  const value = session()?.getItem(POSITION_KEY);

  if (!value) {
    return null;
  }

  const offset = Number(value);

  return Number.isFinite(offset) && offset >= 0 ? offset : null;
}

/**
 * Records the offset the grid was left at and flags the next visit to restore
 * it.
 */
export function rememberHomeExit(offset: number) {
  const store = session();

  if (!store) {
    return;
  }

  store.setItem(POSITION_KEY, String(Math.max(0, Math.round(offset))));
  store.setItem(RETURNING_KEY, "1");
}

/** Consumes the "returning to the grid" mark: true only once per exit. */
export function takeHomeReturn(): boolean {
  const store = session();

  if (!store || store.getItem(RETURNING_KEY) !== "1") {
    return false;
  }

  store.removeItem(RETURNING_KEY);

  return true;
}
