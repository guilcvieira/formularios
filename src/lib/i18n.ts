'use client';

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { defaultNS, fallbackLng, resources } from '../../shared/i18n/resources';

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng,
      defaultNS,
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['localStorage', 'cookie', 'navigator', 'htmlTag'],
        caches: ['localStorage', 'cookie'],
        lookupCookie: 'i18next',
      },
      supportedLngs: Object.keys(resources),
      react: {
        useSuspense: false,
      },
    });
}

export default i18n;
