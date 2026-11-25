/** Wrap any integer into [0, count). */
export function wrapIndex(index: number, count: number): number {
  return ((index % count) + count) % count;
}

/**
 * Signed distance of a card from the active card on a circular track,
 * e.g. with 5 cards: active → 0, neighbours → ±1, far cards → ±2.
 */
export function circularOffset(index: number, active: number, count: number): number {
  let d = wrapIndex(index - active, count);
  if (d > count / 2) d -= count;
  return d;
}
