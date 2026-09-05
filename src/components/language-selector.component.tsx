import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { supportedLanguages } from '../../constants';
import { Language } from '../i18n';
import { splitPathname, translateLocalizedRoute } from '../nav-utils';
import { useSearchParamsUtils } from '../search-params-utils';

export const LanguageSelector: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { navigateWithSearch } = useSearchParamsUtils();

  const handleLanguageChange = (language: Language) => {
    const nextLocation = translateLocalizedRoute(location.pathname, language);
    navigateWithSearch(nextLocation, { removeLocalParameters: false });
  };

  useEffect(() => {
    const { language } = splitPathname(location.pathname);
    if (language !== i18n.language && supportedLanguages.includes(language as Language)) {
      i18n.changeLanguage(language);
    }
  }, [location, i18n]);

  return (
    <select
      value={i18n.language}
      onChange={(e) => handleLanguageChange(e.target.value as Language)}
      style={{ marginRight: 8 }}
    >
      {supportedLanguages.map((language) => (
        <option key={language} value={language}>
          {t(`language.${language}`)}
        </option>
      ))}
    </select>
  );
};
