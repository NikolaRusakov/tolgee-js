<script lang="ts">
  import { TolgeeProvider } from '$lib';
  import type { TolgeeInstance } from '@tolgee/web';
  import TestUseTranslateInside from './TestUseTranslateInside.svelte';

  const { tolgee }: { tolgee: TolgeeInstance } = $props();
</script>

<TolgeeProvider {tolgee} fallback="Loading...">
  <TestUseTranslateInside />
</TolgeeProvider>
