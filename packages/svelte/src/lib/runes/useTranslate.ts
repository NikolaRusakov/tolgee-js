import { onDestroy } from 'svelte';
import type { NsFallback, TranslationKey } from '@tolgee/web';
import { getTolgeeContext } from '../getTolgeeContext';
import { createTranslate, type CreateTranslateResult } from './createTranslate';

export type UseTranslateResult<K extends string = TranslationKey> = Omit<
  CreateTranslateResult<K>,
  'destroy'
>;

/**
 * Runes-native translation helper for Svelte 5.
 *
 * Must be called during component initialization (like `getContext`).
 *
 * ```svelte
 * <script lang="ts">
 *   import { useTranslate } from '@tolgee/svelte';
 *   const { t, isLoading } = useTranslate('common');
 *   const title = $derived(t('page_title'));
 * </script>
 *
 * {#if !isLoading}<h1>{title}</h1>{/if}
 * ```
 *
 * @param ns namespace(s) to load and use as the default for `t`
 */
export function useTranslate<K extends string = TranslationKey>(
  ns?: NsFallback
): UseTranslateResult<K> {
  const { tolgee } = getTolgeeContext();
  if (!tolgee) {
    throw new Error('Tolgee instance not provided');
  }
  const result = createTranslate<K>(tolgee, ns);
  onDestroy(result.destroy);
  return {
    t: result.t,
    get isLoading() {
      return result.isLoading;
    }
  };
}
