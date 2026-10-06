<script lang="ts">
  // legacy-mode parent (no runes) rendering the runes provider
  import type { TolgeeInstance } from '@tolgee/web';
  import { TolgeeProvider } from '$lib';

  export let tolgee: TolgeeInstance;
</script>

<TolgeeProvider {tolgee} fallback="loading">
  <div>It's rendered!</div>
</TolgeeProvider>
