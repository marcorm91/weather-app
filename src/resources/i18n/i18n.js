import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import esTranslation from './locales/es.json';
import enTranslation from './locales/en.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: {
        translation: esTranslation,
      },
      en: {
        translation: enTranslation,
      },
    },
    lng: 'es',
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on('languageChanged', language => { document.documentElement.lang = language })

export default i18n;
