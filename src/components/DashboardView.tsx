import React from 'react';
import {
  FileText,
  Clock,
  Award,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  PlusCircle,
  Play,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { ExamAttempt } from '../types/exam';
import { AnalyticsSummary } from '../utils/storage';
import { translations, Locale } from '../utils/i18n';
import { SAMPLE_STUDY_MODULES } from '../data/sampleMedicalModules';

interface DashboardViewProps {
  attempts: ExamAttempt[];
  analytics: AnalyticsSummary;
  onStartNewExam: () => void;
  onRetakeExam: (attempt: ExamAttempt) => void;
  onRetryIncorrectOnly: (attempt: ExamAttempt) => void;
  onReviewAttempt: (attempt: ExamAttempt) => void;
  onDeleteAttempt: (attemptId: string) => void;
  onSelectSampleModule: (moduleId: string) => void;
  locale: Locale;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  attempts,
  analytics,
  onStartNewExam,
  onRetakeExam,
  onRetryIncorrectOnly,
  onReviewAttempt,
  onDeleteAttempt,
  onSelectSampleModule,
  locale,
}) => {
  const t = translations[locale];
  const isAr = locale === 'ar';

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Welcome & Quick Action Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{t.welcomeBack}</span>
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t.analyticsHeadline}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              {isAr
                ? 'منصة توليد واجتياز الامتحانات الطبية التفاعلية بناءً على المحاضرات والمراجع الأكاديمية مع تفسيرات سريرية معمقة.'
                : 'Interactive medical assessment platform powered by grounded lecture notes, clinical vignettes, and mechanism explanations.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onStartNewExam}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 active:scale-95 transition-all"
            >
              <PlusCircle className="h-4 w-4" />
              <span>{t.startFirstExam}</span>
            </button>
          </div>
        </div>

        {/* Real Performance Metric Cards (only real values, never fake) */}
        {attempts.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <FileText className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <span>{t.totalExamsTaken}</span>
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {analytics.totalExams}
              </div>
              <div className="mt-0.5 text-xs text-slate-500">
                {analytics.totalQuestionsAnswered} {isAr ? 'سؤال منجز' : 'questions answered'}
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>{t.avgScore}</span>
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {analytics.averageScorePercentage}%
              </div>
              <div className="mt-0.5 text-xs text-slate-500">
                {isAr ? 'المعدل التراكمي' : 'Cumulative accuracy'}
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Award className="h-4 w-4 text-amber-500" />
                <span>{t.bestScore}</span>
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {analytics.highestScorePercentage}%
              </div>
              <div className="mt-0.5 text-xs text-slate-500">
                {isAr ? 'أفضل أداء مسجل' : 'Highest exam score'}
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>{t.timeInvested}</span>
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {analytics.totalTimeSpentMinutes}
                <span className="text-xs font-normal text-slate-500 ml-1">{t.minutes}</span>
              </div>
              <div className="mt-0.5 text-xs text-slate-500">
                {isAr ? 'وقت التقييم السريري' : 'Total testing duration'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Weak & Strong Topic Diagnostics */}
      {attempts.length > 0 && analytics.weakTopics.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6 dark:border-amber-900/60 dark:bg-amber-950/20">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-amber-100 p-2 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {t.weakAreas}
              </h2>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                {t.weakAreasDesc}
              </p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {analytics.weakTopics.map((item) => (
                  <div
                    key={item.topic}
                    className="flex items-center justify-between rounded-xl border border-amber-200/80 bg-white p-3 shadow-xs dark:border-amber-900/50 dark:bg-slate-900"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        {item.topic}
                      </div>
                      <div className="text-xs text-slate-500">
                        {item.totalQuestions} {isAr ? 'أسئلة مسجلة' : 'questions tested'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-amber-600 dark:text-amber-400">
                        {item.accuracy}%
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {isAr ? 'دقة الإجابة' : 'Accuracy'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Launch High-Yield Study Modules */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {isAr ? 'المقررات الطبية المعتمدة للتدريب السريع' : 'High-Yield Medical Study Modules'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAr
                ? 'مقررات سريرية جاهزة وموثقة مسبقاً لاختبار قدراتك فوراً'
                : 'Verified clinical curricula ready for instant exam generation and board practice'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SAMPLE_STUDY_MODULES.map((module) => (
            <div
              key={module.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-all hover:border-teal-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-800/40"
            >
              <div>
                <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                  {module.category}
                </span>
                <h3 className="mt-1 text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                  {isAr ? module.titleAr : module.title}
                </h3>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-3">
                  {isAr ? module.descriptionAr : module.description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {module.verifiedQuestions.length} {isAr ? 'أسئلة موثقة' : 'Verified MCQs'}
                </span>
                <button
                  onClick={() => onSelectSampleModule(module.id)}
                  className="flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400"
                >
                  <Play className="h-3 w-3" />
                  <span>{isAr ? 'بدء الاختبار' : 'Practice'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Examinations History */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {isAr ? 'سجل الاختبارات المنجزة' : 'Recently Completed Examinations'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAr
                ? 'مراجعة النتائج السابقة وإعادة المحاولة والتركيز على الأسئلة الخاطئة'
                : 'Review past performance diagnostics, retake exams, or revise missed questions'}
            </p>
          </div>
          {attempts.length > 0 && (
            <span className="text-xs font-medium text-slate-500">
              {attempts.length} {isAr ? 'سجل محفوظ' : 'record(s)'}
            </span>
          )}
        </div>

        {attempts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center dark:border-slate-700">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
              {t.noExamsTitle}
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {t.noExamsDesc}
            </p>
            <div className="mt-5">
              <button
                onClick={onStartNewExam}
                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-teal-700"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>{t.startFirstExam}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {attempts.map((attempt) => {
              const pass = attempt.percentage >= 70;
              const hasIncorrect = attempt.incorrectCount > 0;
              return (
                <div
                  key={attempt.id}
                  className="py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {attempt.examTitle}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          pass
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {attempt.percentage}%
                      </span>
                      <span className="text-[10px] font-medium text-slate-500 uppercase">
                        {attempt.mode === 'practice' ? (isAr ? 'نمط تدريب' : 'Practice') : (isAr ? 'اختبار رسمي' : 'Formal')}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span>{attempt.sourceDocument}</span>
                      <span>·</span>
                      <span>
                        {attempt.correctCount} / {attempt.totalQuestions} {isAr ? 'صحيحة' : 'correct'}
                      </span>
                      <span>·</span>
                      <span>
                        {Math.round(attempt.timeSpentSeconds / 60)} {t.minutes}
                      </span>
                      <span>·</span>
                      <span>
                        {new Date(attempt.completedAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => onReviewAttempt(attempt)}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      {t.reviewResults}
                    </button>

                    {hasIncorrect && (
                      <button
                        onClick={() => onRetryIncorrectOnly(attempt)}
                        className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
                        title={isAr ? 'إعادة الإجابة على الأسئلة الخاطئة فقط' : 'Retest only the questions you missed'}
                      >
                        <RotateCcw className="inline h-3 w-3 mr-1" />
                        {t.retryIncorrect}
                      </button>
                    )}

                    <button
                      onClick={() => onRetakeExam(attempt)}
                      className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700"
                    >
                      {t.retakeExam}
                    </button>

                    <button
                      onClick={() => onDeleteAttempt(attempt.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                      title={t.deleteRecord}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
