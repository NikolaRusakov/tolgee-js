import '@testing-library/jest-dom';
import UseTranslateNamespaces from './components/UseTranslateNamespaces.svelte';
import { render, screen, waitFor } from '@testing-library/svelte';
import { vi } from 'vitest';
import { Tolgee, DevTools, type TolgeeInstance } from '@tolgee/web';
import { FormatIcu } from '@tolgee/format-icu';
import { mockStaticDataAsync } from '@tolgee/testing/mockStaticData';
import { GlobalContextPlugin } from '$lib/GlobalContextPlugin';

describe('useTranslate namespaces (runes)', () => {
  let tolgee: TolgeeInstance;
  let staticDataMock: ReturnType<typeof mockStaticDataAsync>;

  beforeEach(async () => {
    staticDataMock = mockStaticDataAsync();
    tolgee = Tolgee().use(DevTools()).use(GlobalContextPlugin()).use(FormatIcu()).init({
      language: 'cs',
      fallbackLanguage: 'en',
      fallbackNs: 'fallback',
      staticData: staticDataMock.promises
    });

    const runPromise = tolgee.run();
    staticDataMock.resolvePending();
    await runPromise;
  });

  it('loads namespace after render and updates isLoading', async () => {
    const { unmount } = render(UseTranslateNamespaces);
    expect(screen.queryByTestId('loading')).toContainHTML('Loading...');
    expect(tolgee.isLoaded('test')).toBe(false);
    staticDataMock.resolvePending();
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).toBeFalsy();
      expect(screen.queryByTestId('test')).toContainHTML('Český test');
      expect(screen.queryByTestId('test_english_fallback')).toContainHTML('Test english fallback');
      expect(screen.queryByTestId('ns_fallback')).toContainHTML('Fallback');
    });
    unmount();
  });

  it('removes active namespace on destroy', async () => {
    tolgee = Tolgee().use(DevTools()).use(FormatIcu()).init({ language: 'cs' });
    const removeSpy = vi.fn(tolgee.removeActiveNs);
    const { unmount } = render(UseTranslateNamespaces, {
      context: new Map([['tolgeeContext', { tolgee: { ...tolgee, removeActiveNs: removeSpy } }]])
    });
    unmount();
    expect(removeSpy).toHaveBeenCalledWith(['test']);
  });
});
