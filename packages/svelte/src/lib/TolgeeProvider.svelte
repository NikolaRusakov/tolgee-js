<script lang="ts">
  import { onMount, setContext, type Snippet } from 'svelte';
  import type { TolgeeInstance } from '@tolgee/web';
  import type { TolgeeSvelteContext } from './types';
  import { prepareTolgeeSSR, type SSROptions } from './ssr';

  type Props = {
    /** Initialized Tolgee instance. Keep it stable for the lifetime of the provider. */
    tolgee: TolgeeInstance;
    /** Rendered until the initial translations are loaded. */
    fallback?: Snippet | string;
    children?: Snippet;
    /**
     * Seed language and static data before the first render, so SvelteKit SSR and
     * hydration render translated content immediately.
     */
    ssr?: SSROptions | boolean;
  };

  const { tolgee, fallback, children, ssr }: Props = $props();

  if (ssr) {
    prepareTolgeeSSR(tolgee, typeof ssr === 'object' ? ssr : {});
  }

  let isLoading = $state(!tolgee.isLoaded());

  setContext<TolgeeSvelteContext>('tolgeeContext', { tolgee });

  // runs only in the browser, never during SSR
  onMount(() => {
    tolgee
      .run()
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        isLoading = false;
      });
    return () => tolgee.stop();
  });
</script>

{#if !isLoading}
  {@render children?.()}
{:else if typeof fallback === 'function'}
  {@render fallback()}
{:else if fallback}
  {fallback}
{/if}
