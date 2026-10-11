/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { ExamCreatorView } from './components/ExamCreatorView';
import { ExaminationView } from './components/ExaminationView';
import { ResultsReviewView } from './components/ResultsReviewView';
import { RevisionHubView } from './components/RevisionHubView';
import { ExamAttempt, Question, ExamConfig } from './types/exam';
import {
  getStoredAttempts,
  saveExamAttempt,
  deleteExamAttempt,
  calculateAnalytics,
  getStoredTheme,
  setStoredTheme,
  getStoredUiLanguage,
  setStoredUiLanguage,
} from './utils/storage';
import { Locale } from './utils/i18n';

export default function App() {
  // Navigation & View State
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'create' | 'revision'>('dashboard');
  const [activeView, setActiveView] = useState<
    'dashboard' | 'create' | 'exam' | 'results' | 'revision'
  >('dashboard');

  // Theme & Locale
  const [theme, setTheme] = useState<'light' | 'dark'>(() => getStoredTheme());
  const [locale, setLocale] = useState<Locale>(() => getStoredUiLanguage());

  // Backend / Gemini API status
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(false);

  // Storage data
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);

  // Active Exam & Results State
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [activeExamConfig, setActiveExamConfig] = useState<ExamConfig | null>(null);
  const [currentReviewAttempt, setCurrentReviewAttempt] = useState<ExamAttempt | null>(null);
  const [preselectedModuleId, setPreselectedModuleId] = useState<string | null>(null);

  // Sync theme with DOM
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    setStoredTheme(theme);
  }, [theme]);

  // Sync locale with DOM RTL / LTR
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
    root.setAttribute('lang', locale);
    setStoredUiLanguage(locale);
  }, [locale]);

  // Load initial attempts & check server config
  useEffect(() => {
    const loaded = getStoredAttempts();
    setAttempts(loaded);

    // Check Gemini API status on server
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        setHasGeminiKey(Boolean(data.hasGeminiKey));
      })
      .catch((err) => {
        console.warn('API config check error:', err);
        setHasGeminiKey(false);
      });
  }, []);

  // Calculate real analytics
  const analytics = calculateAnalytics(attempts);

  // Handlers
  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleToggleLocale = () => {
    setLocale((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const handleSelectTab = (tab: 'dashboard' | 'create' | 'revision') => {
    setCurrentTab(tab);
    setActiveView(tab);
    if (tab === 'create') {
      setPreselectedModuleId(null);
    }
  };

  // Launch a new exam
  const handleStartExam = (questions: Question[], config: ExamConfig) => {
    // If exam config specifies language, sync display locale if needed
    if (config.language && config.language !== locale) {
      setLocale(config.language);
    }

    setActiveQuestions(questions);
    setActiveExamConfig(config);
    setActiveView('exam');
  };

  // Exam finished
  const handleFinishExam = (attempt: ExamAttempt) => {
    saveExamAttempt(attempt);
    setAttempts((prev) => [attempt, ...prev]);
    setCurrentReviewAttempt(attempt);
    setActiveView('results');
  };

  // Retake exam
  const handleRetakeExam = (attempt: ExamAttempt) => {
    const config: ExamConfig = {
      title: attempt.examTitle,
      sourceFileName: attempt.sourceDocument,
      questionCount: attempt.questions.length,
      difficulty: 'Mixed',
      style: 'all',
      timeLimitMinutes: Math.round(attempt.timeSpentSeconds / 60) || 15,
      randomizeQuestions: true,
      randomizeOptions: true,
      immediateFeedback: attempt.mode === 'practice',
      examMode: attempt.mode,
      language: attempt.language || locale,
    };
    handleStartExam(attempt.questions, config);
  };

  // Retry incorrect only
  const handleRetryIncorrectOnly = (attempt: ExamAttempt) => {
    const incorrectList = attempt.questions.filter(
      (q) => attempt.userAnswers[q.id] !== q.correctOptionId
    );

    if (incorrectList.length === 0) return;

    const config: ExamConfig = {
      title: `${attempt.examTitle} (Revision)`,
      sourceFileName: attempt.sourceDocument,
      questionCount: incorrectList.length,
      difficulty: 'Mixed',
      style: 'all',
      timeLimitMinutes: 0,
      randomizeQuestions: true,
      randomizeOptions: true,
      immediateFeedback: true,
      examMode: 'practice',
      language: attempt.language || locale,
    };
    handleStartExam(incorrectList, config);
  };

  // Review an attempt
  const handleReviewAttempt = (attempt: ExamAttempt) => {
    setCurrentReviewAttempt(attempt);
    setActiveView('results');
  };

  // Delete an attempt
  const handleDeleteAttempt = (attemptId: string) => {
    const remaining = deleteExamAttempt(attemptId);
    setAttempts(remaining);
  };

  // Select sample module from dashboard
  const handleSelectSampleModule = (moduleId: string) => {
    setPreselectedModuleId(moduleId);
    setCurrentTab('create');
    setActiveView('create');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Do not show standard navbar during full-screen exam mode to minimize distraction */}
      {activeView !== 'exam' && (
        <Navbar
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          locale={locale}
          onToggleLocale={handleToggleLocale}
          missedQuestionsCount={analytics.allIncorrectQuestions.length}
          hasGeminiKey={hasGeminiKey}
        />
      )}

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {activeView === 'dashboard' && (
          <DashboardView
            attempts={attempts}
            analytics={analytics}
            onStartNewExam={() => {
              setCurrentTab('create');
              setActiveView('create');
              setPreselectedModuleId(null);
            }}
            onRetakeExam={handleRetakeExam}
            onRetryIncorrectOnly={handleRetryIncorrectOnly}
            onReviewAttempt={handleReviewAttempt}
            onDeleteAttempt={handleDeleteAttempt}
            onSelectSampleModule={handleSelectSampleModule}
            locale={locale}
          />
        )}

        {activeView === 'create' && (
          <ExamCreatorView
            onStartExam={handleStartExam}
            locale={locale}
            hasGeminiKey={hasGeminiKey}
            preselectedModuleId={preselectedModuleId}
          />
        )}

        {activeView === 'exam' && activeExamConfig && (
          <ExaminationView
            questions={activeQuestions}
            config={activeExamConfig}
            onFinishExam={handleFinishExam}
            onCancelExam={() => {
              setActiveView('dashboard');
              setCurrentTab('dashboard');
            }}
            locale={locale}
          />
        )}

        {activeView === 'results' && currentReviewAttempt && (
          <ResultsReviewView
            attempt={currentReviewAttempt}
            onRetakeExam={() => handleRetakeExam(currentReviewAttempt)}
            onRetryIncorrectOnly={() => handleRetryIncorrectOnly(currentReviewAttempt)}
            onBackToDashboard={() => {
              setActiveView('dashboard');
              setCurrentTab('dashboard');
            }}
            locale={locale}
          />
        )}

        {activeView === 'revision' && (
          <RevisionHubView
            missedQuestions={analytics.allIncorrectQuestions}
            onStartRevisionExam={handleStartExam}
            locale={locale}
          />
        )}
      </main>

      {/* Subtle, Clean Footer */}
      {activeView !== 'exam' && (
        <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              MedQExam · University & Medical Sciences Examination System
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              Grounded Assessment Engine · Strict Academic Integrity
            </span>
          </div>
        </footer>
      )}
    </div>
  );
}
