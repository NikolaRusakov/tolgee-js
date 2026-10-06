import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/svelte';
import { flushSync } from 'svelte';
import { vi } from 'vitest';
import { Tolgee, type TolgeeInstance } from '@tolgee/web';
import { FormatIcu } from '@tolgee/format-icu';
import mockTranslations from '@tolgee/testing/mockTranslations';
import { createTranslate } from '$lib';
import { LabelsStore, track } from './components/labels.svelte';
import TestLabelsStore from './components/TestLabelsStore.svelte';

describe('createTranslate (context-free)', () => {
  let tolgee: TolgeeInstance;

  beforeEach(async () => {
    tolgee = Tolgee()
      .use(FormatIcu())
      .init({
        language: 'cs',
        fallbackLanguage: 'en',
        staticData: { cs: mockTranslations.cs, en: mockTranslations.en }
      });
    await tolgee.run();
  });

  afterEach(() => {
    tolgee.stop();
  });

  it('translates outside of components', () => {
    const { t, destroy } = createTranslate(tolgee);
    expect(t('hello_world')).toEqual('Ahoj světe!');
    expect(t('peter_dogs', { dogsCount: 2 })).toEqual('Petr má 2 psů.');
    destroy();
  });

  it('re-runs effects on language change', async () => {
    const { t, destroy } = createTranslate(tolgee);
    const tracker = track(() => t('hello_world'));
    flushSync();
    expect(tracker.values).toEqual(['Ahoj světe!']);
    await tolgee.changeLanguage('en');
    flushSync();
    expect(tracker.values).toEqual(['Ahoj světe!', 'Hello world!']);
    tracker.cleanup();
    destroy();
  });

  it('works in .svelte.ts class stores with $derived', async () => {
    const store = new LabelsStore(tolgee);
    render(TestLabelsStore, { store });
    expect(screen.getByTestId('hello')).toHaveTextContent('Ahoj světe!');
    expect(screen.getByTestId('dogs')).toHaveTextContent('Petr má 1 psů.');

    store.dogs = 3;
    await tolgee.changeLanguage('en');
    await waitFor(() => {
      expect(screen.getByTestId('hello')).toHaveTextContent('Hello world!');
      expect(screen.getByTestId('dogs')).toHaveTextContent('Peter has 3 dogs.');
    });
    store.destroy();
  });

  it('destroy releases namespaces only once', () => {
    const removeSpy = vi.fn(tolgee.removeActiveNs);
    const result = createTranslate({ ...tolgee, removeActiveNs: removeSpy }, 'test');
    result.destroy();
    result.destroy();
    expect(removeSpy).toHaveBeenCalledTimes(1);
  });
});
