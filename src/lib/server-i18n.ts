import { cookies } from 'next/headers';
import { AppLanguages, fallbackLng, resources } from '../../shared/i18n/resources';

type TranslationOptions = Record<string, string | number>;

function resolveValue(language: AppLanguages, key: string): string {
  const segments = key.split('.');
  let current: unknown = resources[language].common;

  for (const segment of segments) {
    if (typeof current !== 'object' || current === null) {
      return key;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  return typeof current === 'string' ? current : key;
}

function interpolate(template: string, options?: TranslationOptions): string {
  if (!options) {
    return template;
  }

  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, token: string) => {
    const value = options[token];
    return value === undefined ? '' : String(value);
  });
}

export async function getServerT() {
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get('i18next')?.value;

  const language = (cookieLang && cookieLang in resources
    ? cookieLang
    : fallbackLng) as AppLanguages;

  return (key: string, options?: TranslationOptions) => {
    const value = resolveValue(language, key);
    return interpolate(value, options);
  };
}
