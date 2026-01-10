import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translations from './translations.json';

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: translations,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;
