/**
 * @module Topic
 */

/**
 * Describe a subscriber of a topic
 */
export type Subscriber<T = any> = [
  idx: number,
  topic: Topic<T>
];

/**
 * Describe a topic
 */
export type Topic<T = any> = [
  handlers: ((data: T) => any)[],
  subs: Subscriber<T>[]
];

/**
 * Create a topic
 */
export const init = <T>(): Topic<T> => [[], []];

/**
 * Attach a subscriber to the topic
 */
export const attach = <T>(t: Topic<T>, f: (data: T) => any): Subscriber<T> => {
  const s: Subscriber<T> = [t[0].length, t];
  t[0].push(f);
  t[1].push(s);
  return s;
}

/**
 * Swap the subscriber handler with the new one
 * @param t
 * @param f
 */
export const swap = <T>(t: Subscriber<T>, f: (data: T) => any): void => {
  t[1][0][t[0]] = f;
}

/**
 * Detach a subscriber from the topic
 */
export const detach = <T>(t: Subscriber<T>): void => {
  // Move the subscriber at the end of the array
  t[1][1].pop()![0] = t[0];

  const h = t[1][0];
  h[t[0]] = h.pop()!;
}

/**
 * Publish a message to the topic
 */
export const publish = <T>(t: Topic<T>, msg: T): void => {
  // Optimized for fast iteration
  for (let i = 0, h = t[0]; i < h.length; i++)
    h[i](msg);
}
