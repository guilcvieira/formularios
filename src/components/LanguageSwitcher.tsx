'use client';

import { AppLanguages } from '../../shared/i18n/resources';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const currentLanguage = (i18n.resolvedLanguage || i18n.language || 'pt') as AppLanguages;

  return (
    <Select
      value={currentLanguage}
      onValueChange={(value) => {
        void i18n.changeLanguage(value);
        document.cookie = `i18next=${value}; path=/; max-age=31536000`;
      }}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder={t('language.label')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pt">{t('language.portuguese')}</SelectItem>
        <SelectItem value="en">{t('language.english')}</SelectItem>
        <SelectItem value="es">{t('language.spanish')}</SelectItem>
      </SelectContent>
    </Select>
  );
}
