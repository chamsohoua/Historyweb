// src/i18n/LangContext.jsx
import { createContext, useContext, useState } from 'react';
import en from './locales/en.json';
import ar from './locales/ar.json';
import fr from './locales/fr.json';

const LOCALES = { en, ar, fr };

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() =>
    localStorage.getItem('alhq_lang') || 'en'
  );

  const switchLang = (l) => {
    setLang(l);
    localStorage.setItem('alhq_lang', l);
    // Apply RTL for Arabic
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = l;
  };

  const t = (key, vars = {}) => {
    let str = LOCALES[lang]?.[key] ?? LOCALES.en?.[key] ?? key;
    Object.entries(vars).forEach(([k, v]) => {
      str = str.replace(`{{${k}}}`, v);
    });
    return str;
  };

  return (
    <LangContext.Provider value={{ lang, switchLang, t, isRTL: lang === 'ar' }}>
      {children}
    </LangContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useTranslation must be inside LangProvider');
  return ctx;
}
