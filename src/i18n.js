import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en.json';
import mnTranslations from './locales/mn.json';

const resources = {
  en: {
    translation: enTranslations,
  },
  mn: {
    translation: mnTranslations,
  },
};

// Get saved language from localStorage or default to 'mn'
const savedLanguage = localStorage.getItem('language') || 'mn';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
