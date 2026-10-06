import {
  getFallback,
  getTranslateProps,
  type DefaultParamType,
  type NsFallback,
  type TFnType,
  type TolgeeInstance,
  type TranslationKey
} from '@tolgee/web';
import { createTolgeeSubscriber } from './createTolgeeSubscriber';

export type CreateTranslateResult<K extends string = TranslationKey> = {
  /**
   * Translation function. Reactive wherever it is read from a reactive context
   * (template, `$derived`, `$effect`), so it re-renders on language change or
   * when translations are loaded/changed.
   */
  t: TFnType<DefaultParamType, string, K>;
  /**
   * `true` while the requested namespaces are not loaded yet. Reactive.
   */
  readonly isLoading: boolean;
  /**
   * Releases the namespaces registered by this instance.
   * Called automatically by `useTranslate` when the component is destroyed.
   */
  destroy: () => void;
};

/**
 * Context-free variant of `useTranslate`.
 *
 * Use it in `.svelte.ts` modules, class stores or anywhere outside of component
 * initialization, where Svelte context is not available. The caller owns the
 * lifecycle and should call `destroy()` when the result is no longer needed.
 *
 * @param tolgee Tolgee instance
 * @param ns namespace(s) to load and use as the default for `t`
 */
export function createTranslate<K extends string = TranslationKey>(
  tolgee: TolgeeInstance,
  ns?: NsFallback
): CreateTranslateResult<K> {
  const namespaces = getFallback(ns);
  const subscribe = createTolgeeSubscriber(tolgee, ['update']);

  tolgee.addActiveNs(namespaces);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = ((...args: any[]) => {
    subscribe();
    // @ts-expect-error passing params as they were
    const props = getTranslateProps(...args);
    const fallbackNs = props.ns ?? namespaces?.[0];
    return tolgee.t({ ...props, ns: fallbackNs });
  }) as TFnType<DefaultParamType, string, K>;

  let destroyed = false;

  return {
    t,
    get isLoading() {
      subscribe();
      return !tolgee.isLoaded(namespaces);
    },
    destroy() {
      if (!destroyed) {
        destroyed = true;
        tolgee.removeActiveNs(namespaces);
      }
    }
  };
}
