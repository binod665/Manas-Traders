import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './en.json';
import neTranslations from './ne.json';

const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem('manas_lang') || 'en' : 'en';

const resources = {
  en: {
    translation: enTranslations,
  },
  ne: {
    translation: neTranslations,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

// Sync language changes to LocalStorage instantly
i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('manas_lang', lng);
  }
});

export default i18n;
