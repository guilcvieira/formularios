"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { MoonIcon, SunIcon, MonitorIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Tabs defaultValue={theme} className="w-full">
      <TabsList>
        <TabsTrigger value="light" onClick={() => setTheme("light")}>
          <SunIcon className="h-4 w-4" />
          <span className="sr-only">{t('theme.light')}</span>
        </TabsTrigger>
        <TabsTrigger value="dark" onClick={() => setTheme("dark")}>
          <MoonIcon className="h-4 w-4" />
          <span className="sr-only">{t('theme.dark')}</span>
        </TabsTrigger>
        <TabsTrigger value="system" onClick={() => setTheme("system")}>
          <MonitorIcon className="h-4 w-4" />
          <span className="sr-only">{t('theme.system')}</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
