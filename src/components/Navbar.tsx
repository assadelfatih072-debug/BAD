import React from 'react';
import {
  Activity,
  BookOpen,
  LayoutDashboard,
  Moon,
  Sun,
  Languages,
  PlusCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { translations, Locale } from '../utils/i18n';

interface NavbarProps {
  currentTab: 'dashboard' | 'create' | 'revision';
  onSelectTab: (tab: 'dashboard' | 'create' | 'revision') => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  locale: Locale;
  onToggleLocale: () => void;
  missedQuestionsCount: number;
  hasGeminiKey: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  theme,
  onToggleTheme,
  locale,
  onToggleLocale,
  missedQuestionsCount,
  hasGeminiKey,
}) => {
  const t = translations[locale];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-lg p-1 transition-transform active:scale-95"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm shadow-teal-500/20">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                  {t.appTitle}
                </span>
                <span className="rounded bg-teal-50 px-1.5 py-0.5 text-[10px] font-semibold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60">
                  MED ED
                </span>
              </div>
              <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
                {t.appSubtitle}
              </p>
            </div>
          </button>
        </div>

        {/* Primary Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              currentTab === 'dashboard'
                ? 'bg-slate-100 text-teal-700 dark:bg-slate-800 dark:text-teal-400'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">{t.dashboard}</span>
          </button>

          <button
            onClick={() => onSelectTab('create')}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              currentTab === 'create'
                ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white'
            }`}
          >
            <PlusCircle className="h-4 w-4" />
            <span>{t.newExam}</span>
          </button>

          <button
            onClick={() => onSelectTab('revision')}
            className={`relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              currentTab === 'revision'
                ? 'bg-slate-100 text-teal-700 dark:bg-slate-800 dark:text-teal-400'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white'
            }`}
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">{t.revisionMode}</span>
            {missedQuestionsCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[11px] font-bold text-white">
                {missedQuestionsCount}
              </span>
            )}
          </button>
        </nav>

        {/* Global Controls: Language, Theme, API Status */}
        <div className="flex items-center gap-2">
          {/* Gemini AI Status Badge */}
          <div
            title={
              hasGeminiKey
                ? 'Gemini 3.8 Flash medical assessment engine active'
                : 'Local verified medical syllabus engine active'
            }
            className="hidden lg:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
          >
            <Sparkles
              className={`h-3.5 w-3.5 ${
                hasGeminiKey ? 'text-teal-500' : 'text-slate-400'
              }`}
            />
            <span>{hasGeminiKey ? 'Gemini 3.8 Flash' : 'Standard Core'}</span>
          </div>

          {/* Language Switch */}
          <button
            onClick={onToggleLocale}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
            aria-label="Switch language"
          >
            <Languages className="h-3.5 w-3.5 text-slate-500" />
            <span>{locale === 'en' ? 'العربية' : 'English'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            aria-label={theme === 'dark' ? t.lightMode : t.darkMode}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
