/**
 * @module Utils
 */

/**
 * Drop function calls until it doesn't get called for a specific period.
 * @param f - The target function to debounce (it must not throw errors)
 * @param ms - The time period in milliseconds
 */
export const debounce = <const Args extends any[]>(
  f: (...args: Args) => any,
  ms: number,
): ((...args: Args) => void) => {
  let id: any;

  return (...a) => {
    clearTimeout(id);
    id = setTimeout(f, ms, ...a);
  };
};
