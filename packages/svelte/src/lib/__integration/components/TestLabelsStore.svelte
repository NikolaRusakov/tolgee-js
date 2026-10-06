<script lang="ts">
  import type { LabelsStore } from './labels.svelte';

  const { store }: { store: LabelsStore } = $props();
</script>

<div data-testid="hello">{store.hello}</div>
<div data-testid="dogs">{store.dogsLabel}</div>
