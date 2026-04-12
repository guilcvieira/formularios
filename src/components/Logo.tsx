'use client';

import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';

function Logo() {
  const { t } = useTranslation();

  return (
    <Link
      href="/"
      className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-3xl font-bold text-transparent"
    >
      {t('logo.title')}
    </Link>
  );
}

export default Logo;