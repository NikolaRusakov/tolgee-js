<script lang="ts">
  import { useTolgee } from '@tolgee/svelte';

  const tolgee = useTolgee(['pendingLanguage']);

  function handleLanguageChange(e: Event & { currentTarget: HTMLSelectElement }) {
    tolgee.changeLanguage(e.currentTarget.value);
  }
</script>

<select value={tolgee.getPendingLanguage()} onchange={handleLanguageChange} class="lang-selector">
  <option value="en">English</option>
  <option value="cs">Česky</option>
  <option value="fr">Français</option>
  <option value="de">Deutsch</option>
</select>
