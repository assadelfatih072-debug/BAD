import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  LayoutDashboard,
  Filter,
  FileText,
  Printer,
  ChevronDown,
  ChevronUp,
  Share2,
  AlertCircle,
  HelpCircle,
  Bookmark,
  ExternalLink,
} from 'lucide-react';
import { ExamAttempt, Question } from '../types/exam';
import { translations, Locale } from '../utils/i18n';

interface ResultsReviewViewProps {
  attempt: ExamAttempt;
  onRetakeExam: () => void;
  onRetryIncorrectOnly: () => void;
  onBackToDashboard: () => void;
  locale: Locale;
}

export const ResultsReviewView: React.FC<ResultsReviewViewProps> = ({
  attempt,
  onRetakeExam,
  onRetryIncorrectOnly,
  onBackToDashboard,
  locale,
}) => {
  const t = translations[locale];
  const isAr = locale === 'ar';

  // Question filter: 'all' | 'incorrect' | 'flagged'
  const [filter, setFilter] = useState<'all' | 'incorrect' | 'flagged'>('all');

  // Filtered questions
  const filteredQuestions = attempt.questions.filter((q) => {
    const userAns = attempt.userAnswers[q.id];
    const isCorrect = userAns === q.correctOptionId;
    const isFlagged = attempt.flaggedQuestionIds.includes(q.id);

    if (filter === 'incorrect') return !isCorrect;
    if (filter === 'flagged') return isFlagged;
    return true;
  });

  const isPassing = attempt.percentage >= 70;
  const minutesSpent = Math.max(1, Math.round(attempt.timeSpentSeconds / 60));

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(attempt, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MedQExam-Result-${attempt.examTitle.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Results Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-xs print:border-none print:shadow-none">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                {isAr ? 'تقرير التقييم السريري النهائي' : 'Clinical Diagnostic Assessment Report'}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500">
                {attempt.sourceDocument}
              </span>
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {attempt.examTitle}
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              {new Date(attempt.completedAt).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}
            </p>
          </div>

          {/* Overall Percentage Badge */}
          <div className="flex items-center gap-4">
            <div
              className={`flex flex-col items-center justify-center rounded-2xl px-6 py-4 border ${
                isPassing
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300'
              }`}
            >
              <div className="text-3xl sm:text-4xl font-extrabold font-mono">
                {attempt.percentage}%
              </div>
              <div className="text-xs font-semibold uppercase mt-0.5">
                {isPassing ? (isAr ? 'اجتياز متقدم' : 'Mastery Achieved') : (isAr ? 'بحاجة لمراجعة' : 'Review Recommended')}
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown Statistics */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              <span>{t.correct}</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              {attempt.correctCount}
              <span className="text-xs text-slate-400 font-normal ml-1">
                / {attempt.totalQuestions}
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 font-semibold">
              <XCircle className="h-4 w-4" />
              <span>{t.incorrect}</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              {attempt.incorrectCount}
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
              <HelpCircle className="h-4 w-4" />
              <span>{t.unanswered}</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              {attempt.unansweredCount}
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold">
              <Clock className="h-4 w-4" />
              <span>{t.timeSpent}</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              {minutesSpent}
              <span className="text-xs text-slate-400 font-normal ml-1">{t.minutes}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800 pt-6 print:hidden">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>{t.backToDashboard}</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {attempt.incorrectCount > 0 && (
              <button
                onClick={onRetryIncorrectOnly}
                className="flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-900 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200 transition-colors shadow-xs"
              >
                <RotateCcw className="h-4 w-4" />
                <span>{t.retryIncorrect} ({attempt.incorrectCount})</span>
              </button>
            )}

            <button
              onClick={onRetakeExam}
              className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 active:scale-95 transition-all shadow-xs"
            >
              <RotateCcw className="h-4 w-4" />
              <span>{t.retakeThisExam}</span>
            </button>

            <button
              onClick={handleExportJson}
              className="flex items-center gap-1 rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              title={t.exportSummary}
            >
              <FileText className="h-4 w-4" />
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1 rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              title={t.printReport}
            >
              <Printer className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Topic Performance Breakdown */}
      {Object.keys(attempt.topicPerformance).length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {t.performanceBreakdown}
          </h2>
          <div className="space-y-3">
            {Object.entries(attempt.topicPerformance).map(([topic, stat]) => (
              <div key={topic} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">
                    {topic}
                  </span>
                  <span className="text-slate-500 font-mono">
                    {stat.correct} / {stat.total} ({stat.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      stat.percentage >= 75
                        ? 'bg-emerald-500'
                        : stat.percentage >= 50
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Question Analysis Filter & Review */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t.allQuestionsReview}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAr
                ? 'تحليل الإجابات والتفسيرات الفسيولوجية وآليات التشخيص التفريقي'
                : 'In-depth physiological mechanisms, key concepts, and distractor rationale breakdowns.'}
            </p>
          </div>

          {/* Segmented Filter Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              {t.filterAll} ({attempt.questions.length})
            </button>
            <button
              onClick={() => setFilter('incorrect')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filter === 'incorrect'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              {t.filterIncorrect} ({attempt.incorrectCount})
            </button>
            <button
              onClick={() => setFilter('flagged')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filter === 'flagged'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              {t.filterFlagged} ({attempt.flaggedQuestionIds.length})
            </button>
          </div>
        </div>

        {/* Questions Detailed Cards */}
        <div className="space-y-6">
          {filteredQuestions.map((q, idx) => {
            const userAns = attempt.userAnswers[q.id];
            const isCorrect = userAns === q.correctOptionId;
            const isUnanswered = !userAns;
            const originalIndex = attempt.questions.findIndex((item) => item.id === q.id) + 1;

            return (
              <div
                key={q.id}
                className={`rounded-2xl border p-6 space-y-4 transition-all ${
                  isCorrect
                    ? 'border-emerald-200/80 bg-emerald-50/20 dark:border-emerald-900/40 dark:bg-emerald-950/10'
                    : isUnanswered
                    ? 'border-slate-200 bg-slate-50/40 dark:border-slate-800 dark:bg-slate-800/20'
                    : 'border-red-200/80 bg-red-50/20 dark:border-red-900/40 dark:bg-red-950/10'
                }`}
              >
                {/* Question Header & Verdict */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-xl text-xs font-bold ${
                        isCorrect
                          ? 'bg-emerald-600 text-white'
                          : isUnanswered
                          ? 'bg-slate-300 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      {originalIndex}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 uppercase">
                      {q.topic || q.category} · {q.style}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{t.correct}</span>
                      </span>
                    ) : isUnanswered ? (
                      <span className="text-xs font-semibold text-slate-500">
                        {t.unanswered}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400">
                        <XCircle className="h-4 w-4" />
                        <span>{t.incorrect}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Stem */}
                <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-relaxed">
                  {q.question}
                </p>

                {/* Options List */}
                <div className="space-y-2">
                  {q.options.map((opt) => {
                    const isKey = opt.id === q.correctOptionId;
                    const isUserPick = opt.id === userAns;

                    let optStyle =
                      'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300';

                    if (isKey) {
                      optStyle =
                        'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-semibold dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-100';
                    } else if (isUserPick && !isCorrect) {
                      optStyle =
                        'border-red-400 bg-red-50/80 text-red-950 dark:border-red-800 dark:bg-red-950/40 dark:text-red-100';
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`flex items-start gap-3 rounded-xl border p-3 text-xs ${optStyle}`}
                      >
                        <span className="font-bold">{opt.id}.</span>
                        <span className="flex-1 leading-relaxed">{opt.text}</span>
                        {isKey && (
                          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                            {t.correctAnswer}
                          </span>
                        )}
                        {isUserPick && !isCorrect && (
                          <span className="text-[11px] font-bold text-red-600 dark:text-red-400">
                            {t.yourAnswer}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation & Mechanisms */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 text-xs space-y-3">
                  <div>
                    <span className="font-bold text-teal-800 dark:text-teal-300 block mb-1">
                      {t.clinicalRationale}
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {q.explanation.correctRationale}
                    </p>
                  </div>

                  {q.explanation.distractorRationales &&
                    Object.keys(q.explanation.distractorRationales).length > 0 && (
                      <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                        <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                          {t.distractorAnalysis}
                        </span>
                        <div className="space-y-1 text-slate-600 dark:text-slate-400">
                          {Object.entries(q.explanation.distractorRationales).map(
                            ([optKey, rationale]) => (
                              <div key={optKey}>
                                <strong className="font-mono text-slate-800 dark:text-slate-200">
                                  {optKey}:{' '}
                                </strong>
                                <span>{rationale}</span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {q.explanation.sourceReference && (
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-2 flex items-center justify-between text-[11px] text-slate-500">
                      <span>
                        <strong className="text-slate-600 dark:text-slate-400">
                          {t.sourceEvidence}:{' '}
                        </strong>
                        {q.explanation.sourceReference}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
