import { createTranslate } from '$lib';
import type { TolgeeInstance } from '@tolgee/web';

/** Class store using translations outside of component context. */
export class LabelsStore {
  #translate;
  dogs = $state(1);

  constructor(tolgee: TolgeeInstance) {
    this.#translate = createTranslate(tolgee);
  }

  get hello() {
    return this.#translate.t('hello_world');
  }

  dogsLabel = $derived.by(() => this.#translate.t('peter_dogs', { dogsCount: this.dogs }));

  destroy() {
    this.#translate.destroy();
  }
}

/** Collects values of `fn` from an effect, outside of any component. */
export function track<T>(fn: () => T) {
  const values: T[] = [];
  const cleanup = $effect.root(() => {
    $effect(() => {
      values.push(fn());
    });
  });
  return { values, cleanup };
}
