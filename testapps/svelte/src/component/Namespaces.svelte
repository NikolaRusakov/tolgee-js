<script lang="ts">
  import { useTranslate, T } from '@tolgee/svelte';
  const translate = useTranslate('namespaced');
  const { t } = translate;
</script>

{#if translate.isLoading}
  <div>Loading namespace...</div>
{:else}
  <div class="tiles namespaces">
    <div>
      <h1>t function with namespace</h1>
      <div>{t('this_is_a_key')}</div>
    </div>

    <div>
      <h1>t function with default namespace</h1>
      <div>{t('this_is_a_key', { ns: '' })}</div>
    </div>

    <div>
      <h1>T component with namespace</h1>
      <div>
        <T keyName="this_is_a_key" ns="namespaced" />
      </div>
    </div>
  </div>
{/if}
