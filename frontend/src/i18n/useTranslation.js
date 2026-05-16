import { useContext } from 'react';
import { AppContext } from '../App.jsx';
import { t as translate } from './translations.js';

export function useTranslation() {
  const { lang } = useContext(AppContext);
  const t = (key) => translate(key, lang);
  return { t, lang, isHindi: lang === 'hi' };
}
