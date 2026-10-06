// @vitest-environment node
import { render } from 'svelte/server';
import { vi } from 'vitest';
import { Tolgee } from '@tolgee/web';
import { FormatIcu } from '@tolgee/format-icu';
import mockTranslations from '@tolgee/testing/mockTranslations';
import SsrApp from './components/SsrApp.svelte';

describe('TolgeeProvider SSR', () => {
  it('renders translated content on the server without running tolgee', () => {
    const instance = Tolgee().use(FormatIcu()).init({ fallbackLanguage: 'en' });
    const runSpy = vi.fn(instance.run);
    const tolgee = { ...instance, run: runSpy };

    const { body } = render(SsrApp, {
      props: {
        tolgee,
        language: 'cs',
        staticData: { cs: mockTranslations.cs, en: mockTranslations.en }
      }
    });

    expect(body).toContain('Ahoj světe!');
    expect(body).toContain('Petr má 5 psů.');
    expect(body).not.toContain('Loading...');
    expect(body).not.toContain('_tolgee');
    expect(runSpy).not.toHaveBeenCalled();
  });

  it('renders fallback and warns when static data is missing', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const tolgee = Tolgee().use(FormatIcu()).init({ fallbackLanguage: 'en' });

    const { body } = render(SsrApp, {
      props: { tolgee, language: 'cs', staticData: { cs: mockTranslations.cs } }
    });

    expect(body).toContain('Loading...');
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('"en"'));
    warn.mockRestore();
  });
});
