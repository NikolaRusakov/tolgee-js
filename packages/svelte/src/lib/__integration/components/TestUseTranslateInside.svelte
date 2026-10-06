<script lang="ts">
  import { useTranslate } from '$lib';

  const { t } = useTranslate();
  const derivedHello = $derived(t('hello_world'));
</script>

<div>
  <div data-testid="peter_dogs">{t('peter_dogs', { dogsCount: 5 })}</div>
  <div data-testid="hello_world">{t('hello_world')}</div>
  <div data-testid="hello_world_no_wrap">{t({ key: 'hello_world', noWrap: true })}</div>
  <div data-testid="non_existant">{t('non_existant', 'Non existant')}</div>
  <div data-testid="derived">{derivedHello}</div>
</div>
