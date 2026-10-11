import { ExamAttempt, Question } from '../types/exam';

const STORAGE_KEYS = {
  ATTEMPTS: 'medqexam_attempts_v1',
  SAVED_EXAMS: 'medqexam_saved_exams_v1',
  THEME: 'medqexam_theme_v1',
  LANGUAGE: 'medqexam_ui_lang_v1',
};

export const getStoredAttempts = (): ExamAttempt[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load exam attempts:', e);
    return [];
  }
};

export const saveExamAttempt = (attempt: ExamAttempt): void => {
  try {
    const attempts = getStoredAttempts();
    // Add new attempt at beginning
    const updated = [attempt, ...attempts].slice(0, 50); // keep last 50
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save exam attempt:', e);
  }
};

export const deleteExamAttempt = (attemptId: string): ExamAttempt[] => {
  try {
    const attempts = getStoredAttempts().filter((a) => a.id !== attemptId);
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));
    return attempts;
  } catch (e) {
    console.error('Failed to delete attempt:', e);
    return [];
  }
};

export interface AnalyticsSummary {
  totalExams: number;
  totalQuestionsAnswered: number;
  averageScorePercentage: number;
  highestScorePercentage: number;
  totalTimeSpentMinutes: number;
  weakTopics: Array<{ topic: string; accuracy: number; totalQuestions: number }>;
  strongTopics: Array<{ topic: string; accuracy: number; totalQuestions: number }>;
  allIncorrectQuestions: Question[];
}

export const calculateAnalytics = (attempts: ExamAttempt[]): AnalyticsSummary => {
  if (attempts.length === 0) {
    return {
      totalExams: 0,
      totalQuestionsAnswered: 0,
      averageScorePercentage: 0,
      highestScorePercentage: 0,
      totalTimeSpentMinutes: 0,
      weakTopics: [],
      strongTopics: [],
      allIncorrectQuestions: [],
    };
  }

  let totalQuestions = 0;
  let totalScoreSum = 0;
  let highestPercentage = 0;
  let totalSeconds = 0;

  const topicMap: Record<string, { correct: number; total: number }> = {};
  const incorrectQuestionsMap = new Map<string, Question>();

  for (const attempt of attempts) {
    totalQuestions += attempt.totalQuestions;
    totalScoreSum += attempt.percentage;
    if (attempt.percentage > highestPercentage) {
      highestPercentage = attempt.percentage;
    }
    totalSeconds += attempt.timeSpentSeconds || 0;

    // Track topics
    for (const q of attempt.questions) {
      const topicName = q.topic || q.category || 'General';
      if (!topicMap[topicName]) {
        topicMap[topicName] = { correct: 0, total: 0 };
      }
      topicMap[topicName].total += 1;

      const userAnswer = attempt.userAnswers[q.id];
      if (userAnswer === q.correctOptionId) {
        topicMap[topicName].correct += 1;
      } else {
        // Collect incorrect question for revision bank
        incorrectQuestionsMap.set(q.id, q);
      }
    }
  }

  const topicList = Object.entries(topicMap).map(([topic, data]) => ({
    topic,
    accuracy: Math.round((data.correct / Math.max(data.total, 1)) * 100),
    totalQuestions: data.total,
  }));

  const weakTopics = topicList
    .filter((t) => t.accuracy < 65 && t.totalQuestions >= 2)
    .sort((a, b) => a.accuracy - b.accuracy);

  const strongTopics = topicList
    .filter((t) => t.accuracy >= 75 && t.totalQuestions >= 2)
    .sort((a, b) => b.accuracy - a.accuracy);

  return {
    totalExams: attempts.length,
    totalQuestionsAnswered: totalQuestions,
    averageScorePercentage: Math.round(totalScoreSum / attempts.length),
    highestScorePercentage: Math.round(highestPercentage),
    totalTimeSpentMinutes: Math.round(totalSeconds / 60),
    weakTopics,
    strongTopics,
    allIncorrectQuestions: Array.from(incorrectQuestionsMap.values()),
  };
};

export const getStoredTheme = (): 'light' | 'dark' => {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.THEME);
    if (val === 'dark' || val === 'light') return val;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

export const setStoredTheme = (theme: 'light' | 'dark'): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (e) {
    console.error('Failed to save theme:', e);
  }
};

export const getStoredUiLanguage = (): 'en' | 'ar' => {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    if (val === 'ar' || val === 'en') return val;
    return 'en';
  } catch {
    return 'en';
  }
};

export const setStoredUiLanguage = (lang: 'en' | 'ar'): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  } catch (e) {
    console.error('Failed to save language:', e);
  }
};
