import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { supportedLanguages } from '../../../constants';
import { ca } from './ca';
import { en } from './en';

export const defaultLanguage = 'en';
export type Language = typeof supportedLanguages[number];

i18n.use(initReactI18next).init({
  resources: {
    ca: { translation: ca },
    en: { translation: en },
  },
  lng: defaultLanguage,
  fallbackLng: defaultLanguage,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
