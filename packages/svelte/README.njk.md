{% import "../../readmeMacros/macros.njk.md" as macros %}
{{ macros.header('Tolgee for Svelte', 'The Tolgee i18n SDK for Svelte', packageName) }}

# What is Tolgee for Svelte?
Svelte integration library of Tolgee. With this package, it's super simple to add i18n to your Svelte app!
For more information about using Tolgee with Svelte, visit the [docs 📖](https://tolgee.io/integrations/svelte).

Localize (translate) your Svelte or SvelteKit projects to multiple languages with Tolgee.
Integration of Tolgee is extremely simple! 🇯🇵 🇰🇷 🇩🇪 🇨🇳 🇺🇸 🇫🇷 🇪🇸 🇮🇹 🇷🇺 🇬🇧

{{ macros.integrationLinks('Tolgee for Angular docs', macros.v5link('integrations/svelte/installation')) }}

{{ macros.installation('svelte') }}

{% raw %}
Requires Svelte 5.7 or newer. All components are runes-native, so the package works with
`compilerOptions.runes = true`.

Then use the library in your app:

```svelte
<script lang="ts">
  import { TolgeeProvider, Tolgee, DevTools, FormatSimple } from '@tolgee/svelte';

  let { children } = $props();

  const tolgee = Tolgee()
    .use(DevTools())
    .use(FormatSimple())
    .init({
      apiUrl: import.meta.env.VITE_TOLGEE_API_URL,
      apiKey: import.meta.env.VITE_TOLGEE_API_KEY,
      language: 'en'
    });
</script>

<TolgeeProvider {tolgee}>
  {#snippet fallback()}
    <div>Loading...</div>
  {/snippet}
  {@render children()}
</TolgeeProvider>
```

`fallback` also accepts a plain string: `<TolgeeProvider {tolgee} fallback="Loading...">`.

## Usage

To translate texts using Tolgee Svelte integration, you can use `T` component or the
`useTranslate` function.

### T component

```svelte
<script>
  import { T } from '@tolgee/svelte';
</script>

<T keyName="key" defaultValue="This is default" />
```

### useTranslate function

`useTranslate` returns a plain `t` function. It is reactive wherever it is read: in the template,
in `$derived` and in `$effect`. Call it during component initialization.

```svelte
<script lang="ts">
  import { useTranslate } from '@tolgee/svelte';

  const translate = useTranslate('common');
  const { t } = translate;
  const title = $derived(t('page_title'));
</script>

{#if translate.isLoading}
  Loading...
{:else}
  <h1>{title}</h1>
  <p>{t('this_is_a_key', { key: 'value', key2: 'value2' })}</p>
{/if}
```

### Translating outside of components

`createTranslate` is the context-free variant for `.svelte.ts` modules and class stores. You own
its lifecycle, so call `destroy()` when it is no longer needed.

```ts
// labels.svelte.ts
import { createTranslate } from '@tolgee/svelte';
import { tolgee } from './tolgee';

class Labels {
  #translate = createTranslate(tolgee, 'common');
  count = $state(0);
  summary = $derived.by(() => this.#translate.t('items_count', { count: this.count }));
}
```

### Changing the language

Use `useTolgee` to read reactive Tolgee state and change the language.

```svelte
<script lang="ts">
  import { useTolgee } from '@tolgee/svelte';

  const tolgee = useTolgee(['pendingLanguage']);
</script>

<select
  value={tolgee.getPendingLanguage()}
  onchange={(e) => tolgee.changeLanguage(e.currentTarget.value)}
>
  ...
</select>
```

### Server-side rendering (SvelteKit)

Pass the language and the static data to the provider. Tolgee is seeded before the first render,
so the server HTML and hydration contain the translations. `tolgee.run()` is only called in the
browser.

```svelte
<!-- +layout.svelte -->
<TolgeeProvider {tolgee} ssr={{ language: data.language, staticData: data.staticData }}>
  {@render children()}
</TolgeeProvider>
```

### Legacy store API

`getTranslate` and `getTolgee` still return Svelte stores (`$t(...)`, `$tolgee`). They keep
working, but new code should use `useTranslate` and `useTolgee`.

### Migrating from 7.x

- `TolgeeProvider` takes a `fallback` snippet or string. A named `slot="fallback"` from the parent
  is no longer rendered, because Svelte 5 does not pass named slots into runes components.
- Replace `$t(...)` from `getTranslate` with `t(...)` from `useTranslate`, and `$tolgee` from
  `getTolgee` with `useTolgee`.
{% endraw %}

{{ macros.prereq('Svelte') }}

{{ macros.why() }}

## Development
{{ macros.developmentInstallation() }}
{{ macros.development('svelte') }}

{{ macros.developmentTesting('/packages/svelte') }}

{{ macros.e2eTesting('svelte') }}

{{ macros.contributors() }}
