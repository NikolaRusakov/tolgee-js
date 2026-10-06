<script lang="ts">
  import type { NsType, TranslateParams, TranslationKey } from '@tolgee/web';
  import { useTranslate } from './runes/useTranslate';

  type Props = {
    keyName: TranslationKey;
    params?: TranslateParams;
    noWrap?: boolean;
    defaultValue?: string;
    ns?: NsType;
    language?: string;
  };

  const { keyName, params, noWrap = false, defaultValue, ns, language }: Props = $props();

  if (!keyName) {
    console.error('Missing keyName prop!');
  }

  const { t } = useTranslate();
</script>

{t({
  key: keyName,
  params,
  noWrap,
  defaultValue,
  ns,
  language
})}
