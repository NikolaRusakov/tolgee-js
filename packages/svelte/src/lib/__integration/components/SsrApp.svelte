<script lang="ts">
  import { TolgeeProvider, T } from '$lib';
  import type { TolgeeInstance, TolgeeStaticDataProp } from '@tolgee/web';
  import TestUseTranslateInside from './TestUseTranslateInside.svelte';

  const {
    tolgee,
    language,
    staticData
  }: { tolgee: TolgeeInstance; language: string; staticData: TolgeeStaticDataProp } = $props();
</script>

<TolgeeProvider {tolgee} ssr={{ language, staticData }} fallback="Loading...">
  <TestUseTranslateInside />
  <div data-testid="t_component"><T keyName="hello_world" /></div>
</TolgeeProvider>
