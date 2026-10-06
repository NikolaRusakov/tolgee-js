<script lang="ts">
  import { useTranslate } from '$lib';

  const translate = useTranslate('test');
  const { t } = translate;
</script>

<div>
  {#if translate.isLoading}
    <div data-testid="loading">Loading...</div>
  {/if}
  <div data-testid="test">{t('test')}</div>
  <div data-testid="test_english_fallback">{t('test_english_fallback')}</div>
  <div data-testid="ns_fallback">{t('fallback', { ns: 'invalid' })}</div>
</div>
