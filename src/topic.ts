/**
 * @module Topic
 */

/**
 * Describe a subscriber of a topic
 */
export type Subscriber<I = any> = [
  idx: number
] & I;

/**
 * Describe a topic
 */
export type Topic<I = any, T = any> = readonly [
  // Handler references
  ((data: T) => any)[],

  // Subscriber references
  Subscriber<I>[],

  // Types
  Subscriber<I>, T
];

/**
 * Create a topic
 */
export const init = <T>(): Topic<{ readonly _: unique symbol }, T> => [[], []] as any;

/**
 * Attach a subscriber to the topic
 */
export const attach = <T extends Topic>(t: T, f: (data: T) => any): T[2] => {
  // Hold the handler indices
  const s: Subscriber = [t[0].length];
  t[0].push(f);
  t[1].push(s);
  return s;
}

/**
 * Swap the subscriber handler with the new one
 * @param t
 * @param s
 * @param f
 */
export const swap = <T extends Topic>(t: T, s: T[1][number], f: (data: T) => any): void => {
  t[0][s[0]] = f;
}

/**
 * Detach a subscriber from the topic
 * @param t
 * @param s
 */
export const detach = <T extends Topic>(t: T, s: T[1][number]): void => {
  // Move the subscriber to the deleted position
  t[1].pop()![0] = t[0];
  t[0][s[0]] = t[0].pop()!;
}

/**
 * Publish a message to the topic
 */
export const dispatch = <T extends Topic>(t: T, msg: T[3]): void => {
  // Optimized for fast iteration
  for (let i = 0, h = t[0]; i < h.length; i++)
    h[i](msg);
}
