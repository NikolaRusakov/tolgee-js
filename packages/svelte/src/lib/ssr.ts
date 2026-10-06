import { encodeCacheKey, type TolgeeInstance, type TolgeeStaticDataProp } from '@tolgee/web';

export type SSROptions = {
  /**
   * Hard set language to this value, use together with `staticData`
   */
  language?: string;
  /**
   * If provided, static data will be hard set to Tolgee cache for initial render
   */
  staticData?: TolgeeStaticDataProp;
};

/**
 * Seeds the Tolgee instance with language and static data synchronously, so the
 * very first render (on the server and during hydration) already has translations.
 *
 * Events are muted while seeding, so no re-render is triggered mid-render.
 */
export function prepareTolgeeSSR(tolgee: TolgeeInstance, options: SSROptions = {}) {
  const { language, staticData } = options;
  tolgee.setEmitterActive(false);
  if (staticData) {
    tolgee.addStaticData(staticData);
  }
  if (language) {
    void tolgee.changeLanguage(language);
  }
  tolgee.setEmitterActive(true);

  if (!tolgee.isLoaded()) {
    const requiredRecords = tolgee.getRequiredDescriptors(language);
    const providedRecords = tolgee.getAllRecords();
    const missingRecords = requiredRecords
      .map((descriptor) => encodeCacheKey(descriptor))
      .filter((key) => !providedRecords.find((r) => r?.cacheKey === key));

    if (missingRecords.length) {
      console.warn(
        `Tolgee: Missing records in "staticData" for proper SSR functionality: ${missingRecords
          .map((key) => `"${key}"`)
          .join(', ')}`
      );
    }
  }
}
