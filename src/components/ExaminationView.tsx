import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  Edit3,
  HelpCircle,
  Send,
  Sparkles,
  Eye,
  Slash,
  Maximize2,
} from 'lucide-react';
import { ExamConfig, Question, ExamAttempt } from '../types/exam';
import { translations, Locale } from '../utils/i18n';
import { LabValuesModal } from './LabValuesModal';
import { ScratchpadModal } from './ScratchpadModal';

interface ExaminationViewProps {
  questions: Question[];
  config: ExamConfig;
  onFinishExam: (attempt: ExamAttempt) => void;
  onCancelExam: () => void;
  locale: Locale;
}

export const ExaminationView: React.FC<ExaminationViewProps> = ({
  questions,
  config,
  onFinishExam,
  onCancelExam,
  locale,
}) => {
  const t = translations[locale];
  const isAr = locale === 'ar';

  // State: Current index
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // User answers map: questionId -> 'A' | 'B' | 'C' | 'D'
  const [userAnswers, setUserAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});

  // Flagged questions set
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set());

  // Eliminated / Strike-through options map: questionId -> Set<'A' | 'B' | 'C' | 'D'>
  const [eliminatedOptions, setEliminatedOptions] = useState<
    Record<string, Set<'A' | 'B' | 'C' | 'D'>>
  >({});

  // Timer: seconds left
  const totalSecondsAllocated = config.timeLimitMinutes > 0 ? config.timeLimitMinutes * 60 : 0;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(totalSecondsAllocated);
  const [startTime] = useState<number>(Date.now());

  // Scratchpad notes
  const [scratchpadNotes, setScratchpadNotes] = useState<string>('');
  const [isScratchpadOpen, setIsScratchpadOpen] = useState<boolean>(false);

  // Normal lab values modal
  const [isLabModalOpen, setIsLabModalOpen] = useState<boolean>(false);

  // Submit confirmation modal
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);

  // Current Question
  const currentQuestion = questions[currentIndex];

  // Final submission handler
  const handleFinalSubmit = useCallback(() => {
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));

    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    const topicPerf: Record<string, { correct: number; total: number; percentage: number }> = {};
    const catPerf: Record<string, { correct: number; total: number; percentage: number }> = {};

    questions.forEach((q) => {
      const topicKey = q.topic || 'General';
      const catKey = q.category || 'Clinical Medicine';

      if (!topicPerf[topicKey]) topicPerf[topicKey] = { correct: 0, total: 0, percentage: 0 };
      if (!catPerf[catKey]) catPerf[catKey] = { correct: 0, total: 0, percentage: 0 };

      topicPerf[topicKey].total += 1;
      catPerf[catKey].total += 1;

      const ans = userAnswers[q.id];
      if (!ans) {
        unansweredCount += 1;
      } else if (ans === q.correctOptionId) {
        correctCount += 1;
        topicPerf[topicKey].correct += 1;
        catPerf[catKey].correct += 1;
      } else {
        incorrectCount += 1;
      }
    });

    Object.keys(topicPerf).forEach((k) => {
      topicPerf[k].percentage = Math.round((topicPerf[k].correct / topicPerf[k].total) * 100);
    });
    Object.keys(catPerf).forEach((k) => {
      catPerf[k].percentage = Math.round((catPerf[k].correct / catPerf[k].total) * 100);
    });

    const totalQ = questions.length;
    const percentage = Math.round((correctCount / Math.max(totalQ, 1)) * 100);

    const serializedEliminations: Record<string, string[]> = {};
    Object.entries(eliminatedOptions).forEach(([qId, set]) => {
      serializedEliminations[qId] = Array.from(set);
    });

    const attempt: ExamAttempt = {
      id: `attempt-${Date.now()}`,
      examTitle: config.title,
      sourceDocument: config.sourceFileName,
      createdAt: new Date(startTime).toISOString(),
      completedAt: new Date().toISOString(),
      timeSpentSeconds: elapsedSeconds,
      totalQuestions: totalQ,
      userAnswers,
      flaggedQuestionIds: Array.from(flaggedIds),
      eliminatedOptions: serializedEliminations,
      score: correctCount,
      percentage,
      correctCount,
      incorrectCount,
      unansweredCount,
      topicPerformance: topicPerf,
      categoryPerformance: catPerf,
      questions,
      mode: config.examMode,
      language: config.language,
    };

    onFinishExam(attempt);
  }, [
    startTime,
    questions,
    userAnswers,
    flaggedIds,
    eliminatedOptions,
    config,
    onFinishExam,
  ]);

  // Countdown Timer effect
  useEffect(() => {
    if (config.timeLimitMinutes <= 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto submit when time runs out
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [config.timeLimitMinutes, handleFinalSubmit]);

  // Toggle option selection
  const handleSelectOption = (optionId: 'A' | 'B' | 'C' | 'D') => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  // Toggle flag / mark for review
  const handleToggleFlag = () => {
    setFlaggedIds((prev) => {
      const next = new Set(prev);
      if (next.has(currentQuestion.id)) {
        next.delete(currentQuestion.id);
      } else {
        next.add(currentQuestion.id);
      }
      return next;
    });
  };

  // Toggle strike-through / eliminator on an option
  const handleToggleStrikethrough = (
    e: React.MouseEvent,
    optionId: 'A' | 'B' | 'C' | 'D'
  ) => {
    e.stopPropagation();
    setEliminatedOptions((prev) => {
      const qSet = new Set(prev[currentQuestion.id] || []);
      if (qSet.has(optionId)) {
        qSet.delete(optionId);
      } else {
        qSet.add(optionId);
      }
      return {
        ...prev,
        [currentQuestion.id]: qSet,
      };
    });
  };

  // Keyboard Navigation Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in a textarea or input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === '1' || e.key.toLowerCase() === 'a') {
        handleSelectOption('A');
      } else if (e.key === '2' || e.key.toLowerCase() === 'b') {
        handleSelectOption('B');
      } else if (e.key === '3' || e.key.toLowerCase() === 'c') {
        handleSelectOption('C');
      } else if (e.key === '4' || e.key.toLowerCase() === 'd') {
        handleSelectOption('D');
      } else if (e.key.toLowerCase() === 'n' || e.key === 'ArrowRight') {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        }
      } else if (e.key.toLowerCase() === 'p' || e.key === 'ArrowLeft') {
        if (currentIndex > 0) {
          setCurrentIndex((prev) => prev - 1);
        }
      } else if (e.key.toLowerCase() === 'm' || e.key.toLowerCase() === 'f') {
        handleToggleFlag();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, questions.length, currentQuestion.id]);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(userAnswers).length;
  const unansweredCount = questions.length - answeredCount;
  const isCurrentFlagged = flaggedIds.has(currentQuestion.id);
  const currentAnswer = userAnswers[currentQuestion.id];
  const currentEliminated = eliminatedOptions[currentQuestion.id] || new Set();

  return (
    <div className="flex flex-col min-h-[calc(100vh-6rem)] animate-in fade-in duration-150">
      {/* Top Professional Examination Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:px-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs mb-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Exam Title & Subject */}
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {config.title}
                </h2>
                <span className="rounded bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700 dark:bg-teal-950 dark:text-teal-300 uppercase">
                  {config.examMode === 'practice' ? (isAr ? 'نمط تدريب' : 'Practice') : (isAr ? 'اختبار رسمي' : 'Formal Exam')}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentQuestion.category || 'Medical Sciences'} · {currentQuestion.topic || 'Clinical Reasoning'}
              </p>
            </div>
          </div>

          {/* Center: Countdown Timer or Elapsed */}
          <div className="flex items-center gap-3">
            {config.timeLimitMinutes > 0 ? (
              <div
                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-mono font-bold border transition-colors ${
                  secondsRemaining < 300
                    ? 'border-red-300 bg-red-50 text-red-600 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400 animate-pulse'
                    : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                <Clock className="h-4 w-4" />
                <span>{formatTime(secondsRemaining)}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Clock className="h-3.5 w-3.5" />
                <span>{t.unlimitedTime}</span>
              </div>
            )}
          </div>

          {/* Right Tools: Lab values, Scratchpad, End Exam */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLabModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <FileText className="h-3.5 w-3.5 text-teal-600" />
              <span className="hidden sm:inline">{t.normalValuesRef}</span>
              <span className="sm:hidden">{isAr ? 'القيم' : 'Labs'}</span>
            </button>

            <button
              onClick={() => setIsScratchpadOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <Edit3 className="h-3.5 w-3.5 text-amber-500" />
              <span className="hidden sm:inline">{t.calculatorScratchpad}</span>
              <span className="sm:hidden">{isAr ? 'المسودة' : 'Notes'}</span>
            </button>

            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="rounded-lg bg-teal-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-teal-700 active:scale-95 transition-all shadow-xs"
            >
              {t.submitExam}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-teal-500 h-1.5 rounded-full transition-all duration-300"
            style={{
              width: `${Math.round(((currentIndex + 1) / questions.length) * 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Main Examination Workspace: Left Question Area, Right Navigator */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 items-start">
        {/* Question & Answer Card (3 Columns on Desktop) */}
        <div className="lg:col-span-3 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-6">
          {/* Question Subheader: Counter, Flag toggle, Style badge */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {t.questionOf} {currentIndex + 1} {t.of} {questions.length}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs font-semibold text-slate-500 uppercase">
                {currentQuestion.style}
              </span>
            </div>

            {/* Mark for Review Button */}
            <button
              type="button"
              onClick={handleToggleFlag}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold border transition-colors ${
                isCurrentFlagged
                  ? 'border-amber-400 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <Bookmark
                className={`h-3.5 w-3.5 ${
                  isCurrentFlagged ? 'fill-amber-500 text-amber-500' : ''
                }`}
              />
              <span>{isCurrentFlagged ? t.marked : t.markForReview}</span>
            </button>
          </div>

          {/* Question Stem / Clinical Vignette */}
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-base sm:text-lg font-medium text-slate-900 dark:text-slate-100 leading-relaxed sm:leading-8 select-text">
              {currentQuestion.question}
            </p>
          </div>

          {/* Options List */}
          <div className="space-y-3 pt-2">
            <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
              <span>{isAr ? 'اختر الإجابة الصحيحة:' : 'Select the single best answer:'}</span>
              <span className="hidden sm:inline text-[10px]">
                {t.strikethroughNotice}
              </span>
            </div>

            {currentQuestion.options.map((option) => {
              const isSelected = currentAnswer === option.id;
              const isEliminated = currentEliminated.has(option.id);

              // In practice mode, show correct/wrong highlight if answered
              const isPractice = config.examMode === 'practice';
              const isCorrectAnswer = option.id === currentQuestion.correctOptionId;
              let practiceClasses = '';

              if (isPractice && currentAnswer) {
                if (isSelected && isCorrectAnswer) {
                  practiceClasses =
                    'border-emerald-500 bg-emerald-50 text-emerald-950 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-100';
                } else if (isSelected && !isCorrectAnswer) {
                  practiceClasses =
                    'border-red-400 bg-red-50 text-red-950 dark:border-red-700 dark:bg-red-950/40 dark:text-red-100';
                } else if (isCorrectAnswer) {
                  practiceClasses =
                    'border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/30';
                }
              }

              return (
                <div
                  key={option.id}
                  onClick={() => !isEliminated && handleSelectOption(option.id)}
                  className={`group relative flex items-start gap-4 rounded-xl border p-4 text-sm font-medium transition-all cursor-pointer ${
                    practiceClasses
                      ? practiceClasses
                      : isSelected
                      ? 'border-teal-600 bg-teal-50/70 text-teal-950 shadow-xs dark:border-teal-500 dark:bg-teal-950/40 dark:text-white'
                      : isEliminated
                      ? 'border-slate-200 bg-slate-100/60 text-slate-400 line-through dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-600 opacity-60'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 dark:border-slate-800 dark:bg-slate-800/30 dark:hover:border-slate-700 dark:hover:bg-slate-800/60 dark:text-slate-200'
                  }`}
                >
                  {/* Option Badge */}
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold border transition-colors ${
                      isSelected
                        ? 'bg-teal-600 border-teal-600 text-white'
                        : 'bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 group-hover:border-teal-400'
                    }`}
                  >
                    {option.id}
                  </div>

                  {/* Option Text */}
                  <div className="flex-1 pt-0.5 leading-relaxed">
                    {option.text}
                  </div>

                  {/* Strike-through Eliminator Button */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleStrikethrough(e, option.id)}
                    title={isEliminated ? t.clearStrike : 'Eliminate option'}
                    className={`rounded-lg p-1.5 transition-colors opacity-0 group-hover:opacity-100 ${
                      isEliminated
                        ? 'opacity-100 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                        : 'text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Slash className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Immediate Feedback in Practice Mode */}
          {config.examMode === 'practice' && currentAnswer && (
            <div className="mt-6 rounded-xl border border-teal-200 bg-teal-50/70 p-5 dark:border-teal-900/70 dark:bg-teal-950/30 space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2">
                {currentAnswer === currentQuestion.correctOptionId ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 shrink-0" />
                )}
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {currentAnswer === currentQuestion.correctOptionId
                    ? (isAr ? 'إجابة صحيحة!' : 'Correct Answer!')
                    : `${isAr ? 'إجابة خاطئة. الإجابة الصحيحة هي: ' : 'Incorrect. The key answer is: '} (${currentQuestion.correctOptionId})`}
                </span>
              </div>

              <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed border-t border-teal-200/60 dark:border-teal-900/60 pt-3">
                <span className="font-bold text-teal-800 dark:text-teal-300 block mb-1">
                  {isAr ? 'التفسير الفسيولوجي المعتمد:' : 'Physiological Mechanism Rationale:'}
                </span>
                {currentQuestion.explanation.correctRationale}
              </div>

              {currentQuestion.explanation.keyMechanism && (
                <div className="text-[11px] font-mono text-teal-700 dark:text-teal-400">
                  <span className="font-bold">{isAr ? 'المفهوم الأساسي: ' : 'Key Concept: '}</span>
                  {currentQuestion.explanation.keyMechanism}
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => prev - 1)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-30 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>{t.previous}</span>
            </button>

            <span className="text-xs text-slate-400 hidden sm:inline">
              {isAr ? 'اختصارات: N للتالي، P للسابق، A/B/C/D للاختيار' : 'Shortcuts: N for Next, P for Prev, A-D to Answer'}
            </span>

            {currentIndex < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2 text-xs font-bold text-white hover:bg-teal-700 active:scale-95 transition-all shadow-xs"
              >
                <span>{t.next}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 active:scale-95 transition-all shadow-xs"
              >
                <Send className="h-4 w-4" />
                <span>{t.submitExam}</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Drawer / Question Navigator Card */}
        <div className="lg:col-span-1 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {isAr ? 'لوحة تصفح الأسئلة' : 'Question Navigator'}
            </h3>
            <span className="text-xs font-medium text-slate-500">
              {answeredCount}/{questions.length}
            </span>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-teal-600" />
              <span>{isAr ? 'مجاب' : 'Answered'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
              <span>{isAr ? 'غير مجاب' : 'Unanswered'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span>{isAr ? 'محدد للمراجعة' : 'Flagged'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full ring-2 ring-teal-500 bg-transparent" />
              <span>{isAr ? 'الحالي' : 'Current'}</span>
            </div>
          </div>

          {/* Question Grid Badges */}
          <div className="grid grid-cols-5 gap-2 max-h-96 overflow-y-auto p-1">
            {questions.map((q, idx) => {
              const isAnswered = Boolean(userAnswers[q.id]);
              const isFlagged = flaggedIds.has(q.id);
              const isCurrent = idx === currentIndex;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative flex h-9 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                    isCurrent
                      ? 'ring-2 ring-teal-500 ring-offset-2 dark:ring-offset-slate-900'
                      : ''
                  } ${
                    isAnswered
                      ? 'bg-teal-600 text-white'
                      : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  <span>{idx + 1}</span>
                  {isFlagged && (
                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Submit button */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="w-full rounded-xl bg-teal-600 py-2.5 text-xs font-bold text-white hover:bg-teal-700 active:scale-95 transition-all"
            >
              {t.submitExam}
            </button>
          </div>
        </div>
      </div>

      {/* Lab Values Modal */}
      <LabValuesModal
        isOpen={isLabModalOpen}
        onClose={() => setIsLabModalOpen(false)}
        locale={locale}
      />

      {/* Scratchpad Modal */}
      <ScratchpadModal
        isOpen={isScratchpadOpen}
        onClose={() => setIsScratchpadOpen(false)}
        notes={scratchpadNotes}
        onChangeNotes={setScratchpadNotes}
        locale={locale}
      />

      {/* Submit Confirmation Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {t.confirmSubmitTitle}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.confirmSubmitBody}
                </p>
              </div>
            </div>

            {/* Warnings if unanswered or flagged */}
            <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/60 text-xs space-y-2 border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300">
                <span>{isAr ? 'الأسئلة المجابة:' : 'Answered Questions:'}</span>
                <span className="font-mono text-teal-600 dark:text-teal-400">
                  {answeredCount} / {questions.length}
                </span>
              </div>

              {unansweredCount > 0 && (
                <div className="text-amber-700 dark:text-amber-400 flex items-center gap-1.5 font-medium">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    {t.unansweredWarning.replace('{count}', unansweredCount.toString())}
                  </span>
                </div>
              )}

              {flaggedIds.size > 0 && (
                <div className="text-slate-500 flex items-center gap-1.5">
                  <Bookmark className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                  <span>
                    {t.flaggedWarning.replace('{count}', flaggedIds.size.toString())}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {t.cancelSubmit}
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="rounded-xl bg-teal-600 px-5 py-2 text-xs font-bold text-white hover:bg-teal-700 active:scale-95 transition-all shadow-xs"
              >
                {t.confirmSubmitButton}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
