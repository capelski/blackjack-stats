import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Language, supportedLanguages } from '../i18n';
import { splitPathname, translateLocalizedRoute } from '../nav-utils';

export const LanguageSelector: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLanguageChange = (language: Language) => {
    i18n.changeLanguage(language);
    const nextLocation = translateLocalizedRoute(location.pathname, language);
    navigate(nextLocation);
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
      onChange={e => handleLanguageChange(e.target.value as Language)}
      aria-label={t('language.label')}
      style={{ marginLeft: 'auto' }}
    >
      {supportedLanguages.map(language => (
        <option key={language} value={language}>
          {t(`language.${language}`)}
        </option>
      ))}
    </select>
  );
};
