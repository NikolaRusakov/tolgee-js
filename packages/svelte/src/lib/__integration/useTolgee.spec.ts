import '@testing-library/jest-dom';
import { screen, waitFor, render } from '@testing-library/svelte';

import { Tolgee, type TolgeeEvent, type TolgeeInstance, DevTools } from '@tolgee/web';
import { FormatIcu } from '@tolgee/format-icu';
import TestComponent from './components/TestUseTolgee.svelte';
import { mockStaticDataAsync } from '@tolgee/testing/mockStaticData';
import { GlobalContextPlugin } from '$lib/GlobalContextPlugin';

type CheckStateProps = Partial<Record<TolgeeEvent, string>>;

const checkState = (props: CheckStateProps) => {
  Object.entries(props).forEach(([event, value]) => {
    expect(screen.queryByTestId(event)).toContainHTML(value);
  });
};

describe('useTolgee (runes)', () => {
  let tolgee: TolgeeInstance;
  let runPromise: Promise<void>;
  let staticDataMock: ReturnType<typeof mockStaticDataAsync>;

  beforeEach(async () => {
    staticDataMock = mockStaticDataAsync();
    tolgee = Tolgee().use(GlobalContextPlugin()).use(DevTools()).use(FormatIcu()).init({
      language: 'cs',
      staticData: staticDataMock.promises
    });
    runPromise = tolgee.run();
  });

  it('updates initialLoading and running with default events', async () => {
    render(TestComponent);
    checkState({ initialLoad: 'true' });
    staticDataMock.resolvePending();
    await runPromise;
    await waitFor(() => {
      checkState({ initialLoad: 'false', running: 'true' });
    });
  });

  it('updates language and pending language', async () => {
    render(TestComponent, { props: { events: ['language', 'pendingLanguage'] } });
    staticDataMock.resolvePending();
    await runPromise;
    checkState({ language: 'cs', pendingLanguage: 'cs' });
    tolgee.changeLanguage('en');
    await waitFor(() => {
      checkState({ language: 'cs', pendingLanguage: 'en' });
    });
    staticDataMock.resolvePending();
    await waitFor(() => {
      checkState({ language: 'en', pendingLanguage: 'en' });
    });
  });

  it('updates fetching and loading', async () => {
    render(TestComponent, { props: { events: ['loading', 'fetching'] } });
    checkState({ loading: 'true', fetching: 'true' });
    staticDataMock.resolvePending();
    await runPromise;
    await waitFor(() => {
      checkState({ loading: 'false', fetching: 'false' });
    });
    tolgee.addActiveNs('test');
    await waitFor(() => {
      checkState({ loading: 'true', fetching: 'true' });
    });
    staticDataMock.resolvePending();
    await waitFor(() => {
      checkState({ loading: 'false', fetching: 'false' });
    });
  });
});
