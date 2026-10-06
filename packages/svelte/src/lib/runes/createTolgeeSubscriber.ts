import { createSubscriber } from 'svelte/reactivity';
import type { TolgeeEvent, TolgeeInstance } from '@tolgee/web';

/**
 * Bridges Tolgee events into Svelte 5 reactivity.
 *
 * Calling the returned function inside a reactive context (template, `$derived`,
 * `$effect` or a getter read from one of those) registers a dependency, so the
 * context re-runs whenever one of the given Tolgee events fires.
 * Outside of reactive contexts it is a no-op.
 */
export function createTolgeeSubscriber(
  tolgee: TolgeeInstance,
  events: TolgeeEvent[] = ['update']
): () => void {
  return createSubscriber((update) => {
    const subscriptions = events.map((event) => tolgee.on(event, update));
    return () => subscriptions.forEach((s) => s.unsubscribe());
  });
}
