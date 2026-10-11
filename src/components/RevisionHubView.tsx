import React, { useState } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  Trash2,
  Play,
  Layers,
  BookOpen,
  Filter,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { Question, ExamConfig } from '../types/exam';
import { translations, Locale } from '../utils/i18n';

interface RevisionHubViewProps {
  missedQuestions: Question[];
  onStartRevisionExam: (questions: Question[], config: ExamConfig) => void;
  locale: Locale;
}

export const RevisionHubView: React.FC<RevisionHubViewProps> = ({
  missedQuestions,
  onStartRevisionExam,
  locale,
}) => {
  const t = translations[locale];
  const isAr = locale === 'ar';

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [revisionMode, setRevisionMode] = useState<'practice' | 'formal'>('practice');

  // Categories list
  const categories = Array.from(
    new Set(missedQuestions.map((q) => q.category || 'General Medicine'))
  );

  const filteredQuestions =
    selectedCategory === 'all'
      ? missedQuestions
      : missedQuestions.filter(
          (q) => (q.category || 'General Medicine') === selectedCategory
        );

  const handleLaunch = () => {
    if (filteredQuestions.length === 0) return;

    const config: ExamConfig = {
      title: isAr ? 'جلسة مراجعة الأسئلة الخاطئة' : 'Missed Questions Revision Drill',
      sourceFileName: isAr ? 'بنك المراجعة الذكي' : 'Revision Hub Repository',
      questionCount: filteredQuestions.length,
      difficulty: 'Mixed',
      style: 'all',
      timeLimitMinutes: 0, // Untimed by default for revision
      randomizeQuestions: true,
      randomizeOptions: true,
      immediateFeedback: revisionMode === 'practice',
      examMode: revisionMode,
      language: locale,
    };

    onStartRevisionExam(filteredQuestions, config);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{isAr ? 'التعلم القائم على تصحيح الأخطاء' : 'Spaced Repetition & Error Correction'}</span>
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t.revisionMode}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              {isAr
                ? 'مستودع مركزي يجمع كل سؤال أخطأت فيه في أي اختبار سابق، لتمكينك من إعادة التدرب عليه حتى إتقان المفهوم الفسيولوجي بالكامل.'
                : 'Central repository of every missed question from your past examinations. Retest targeted items until core mechanisms are mastered.'}
            </p>
          </div>

          {missedQuestions.length > 0 && (
            <button
              onClick={handleLaunch}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-amber-700 active:scale-95 transition-all"
            >
              <Play className="h-4 w-4" />
              <span>
                {isAr ? 'بدء تدريب المراجعة' : 'Start Revision Drill'} ({filteredQuestions.length})
              </span>
            </button>
          )}
        </div>
      </div>

      {missedQuestions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 mb-4">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {isAr ? 'بنك المراجعة فارغ ومكتمل!' : 'No Missed Questions in Revision Hub!'}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {isAr
              ? 'ممتاز! إما أنك أجبت على جميع الأسئلة السابقة بشكل صحيح أو لم تجتز اختبارات بعد. الأسئلة التي تخطئ بها ستظهر هنا تلقائياً.'
              : 'You have either answered all past questions accurately or have not taken any exams yet. Missed questions will automatically appear here for review.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls: Category Filter and Mode */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            {/* Category selection */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-500">
                {isAr ? 'تصفية حسب التخصص:' : 'Filter Discipline:'}
              </span>
              <button
                onClick={() => setSelectedCategory('all')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {isAr ? 'الكل' : 'All'} ({missedQuestions.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    selectedCategory === cat
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Mode selection */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">
                {isAr ? 'النمط:' : 'Drill Mode:'}
              </span>
              <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                <button
                  onClick={() => setRevisionMode('practice')}
                  className={`rounded-md px-2.5 py-1 font-semibold ${
                    revisionMode === 'practice'
                      ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {isAr ? 'تدريب فوري' : 'Practice (Immediate)'}
                </button>
                <button
                  onClick={() => setRevisionMode('formal')}
                  className={`rounded-md px-2.5 py-1 font-semibold ${
                    revisionMode === 'formal'
                      ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {isAr ? 'اختبار رسمي' : 'Test Mode'}
                </button>
              </div>
            </div>
          </div>

          {/* List of missed questions cards */}
          <div className="space-y-4">
            {filteredQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
                      {idx + 1}
                    </span>
                    <span>{q.category} · {q.topic}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                    {q.difficulty}
                  </span>
                </div>

                <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                  {q.question}
                </p>

                <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-800/40 dark:text-slate-400 border border-slate-100 dark:border-slate-800">
                  <strong className="text-slate-800 dark:text-slate-200 block mb-0.5">
                    {isAr ? 'الآلية التي تحتاج إلى تركيز: ' : 'Target Physiological Concept: '}
                  </strong>
                  <span>{q.explanation.keyMechanism || q.explanation.correctRationale}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleLaunch}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-amber-700 active:scale-95 transition-all"
            >
              <Play className="h-4 w-4" />
              <span>
                {isAr ? 'بدء التدريب على هذه الأسئلة' : 'Launch Targeted Revision Drill'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
