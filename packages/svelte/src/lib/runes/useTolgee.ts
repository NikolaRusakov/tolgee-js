import type { TolgeeEvent, TolgeeInstance } from '@tolgee/web';
import { getTolgeeContext } from '../getTolgeeContext';
import { createTolgeeSubscriber } from './createTolgeeSubscriber';

export const DEFAULT_TOLGEE_EVENTS: TolgeeEvent[] = [
  'update',
  'language',
  'pendingLanguage',
  'loading',
  'fetching',
  'running'
];

/**
 * Wraps a Tolgee instance so reading any of its members from a reactive context
 * re-runs that context when one of the given events fires.
 *
 * Context-free variant of `useTolgee`.
 */
export function createTolgeeState(
  tolgee: TolgeeInstance,
  events: TolgeeEvent[] = DEFAULT_TOLGEE_EVENTS
): TolgeeInstance {
  const subscribe = createTolgeeSubscriber(tolgee, events);
  return new Proxy(tolgee, {
    get(target, prop, receiver) {
      subscribe();
      return Reflect.get(target, prop, receiver);
    }
  });
}

/**
 * Runes-native access to the Tolgee instance from context.
 *
 * ```svelte
 * <script lang="ts">
 *   const tolgee = useTolgee(['pendingLanguage']);
 * </script>
 *
 * <select value={tolgee.getPendingLanguage()}
 *   onchange={(e) => tolgee.changeLanguage(e.currentTarget.value)}>
 * ```
 *
 * @param events Tolgee events that should trigger re-render.
 *   Defaults to all state events.
 */
export function useTolgee(events?: TolgeeEvent[]): TolgeeInstance {
  const { tolgee } = getTolgeeContext();
  return createTolgeeState(tolgee, events);
}
