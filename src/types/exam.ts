export type QuestionDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Mixed';

export type QuestionStyle =
  | 'Clinical Vignette'
  | 'Mechanism/Pathophysiology'
  | 'Conceptual'
  | 'Factual Recall'
  | 'Comparison';

export type MedicalCategory =
  | 'Cardiovascular'
  | 'Renal & Acid-Base'
  | 'Pharmacology'
  | 'Pathology & Immunology'
  | 'Endocrinology'
  | 'Neurology'
  | 'Anatomy & Histology'
  | 'General Medical';

export interface Option {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface QuestionExplanation {
  correctRationale: string;
  distractorRationales?: Record<string, string>;
  keyMechanism?: string;
  sourceReference?: string;
}

export interface Question {
  id: string;
  question: string;
  options: Option[];
  correctOptionId: 'A' | 'B' | 'C' | 'D';
  explanation: QuestionExplanation;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  style: QuestionStyle;
  category?: MedicalCategory | string;
  topic?: string;
  isFlagged?: boolean;
  isAmbiguous?: boolean;
  isExcluded?: boolean;
}

export interface ExamConfig {
  title: string;
  sourceFileName: string;
  questionCount: number;
  difficulty: QuestionDifficulty;
  style: 'all' | 'vignette' | 'mechanism' | 'conceptual' | 'factual' | 'comparison';
  timeLimitMinutes: number; // 0 = unlimited
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
  immediateFeedback: boolean; // Show answer immediately on select
  examMode: 'practice' | 'formal';
  language: 'en' | 'ar';
  selectedTopics?: string[];
  medicalCategory?: string;
}

export interface TopicStat {
  topic: string;
  total: number;
  correct: number;
  percentage: number;
}

export interface CategoryStat {
  category: string;
  total: number;
  correct: number;
  percentage: number;
}

export interface ExamAttempt {
  id: string;
  examTitle: string;
  sourceDocument: string;
  createdAt: string;
  completedAt: string;
  timeSpentSeconds: number;
  totalQuestions: number;
  userAnswers: Record<string, 'A' | 'B' | 'C' | 'D'>;
  flaggedQuestionIds: string[];
  eliminatedOptions: Record<string, string[]>; // questionId -> ['B', 'C'] strike-throughs
  score: number;
  percentage: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  topicPerformance: Record<string, { correct: number; total: number; percentage: number }>;
  categoryPerformance: Record<string, { correct: number; total: number; percentage: number }>;
  questions: Question[];
  mode: 'practice' | 'formal';
  language: 'en' | 'ar';
}

export interface StudyModule {
  id: string;
  title: string;
  titleAr: string;
  category: MedicalCategory;
  description: string;
  descriptionAr: string;
  sampleText: string;
  verifiedQuestions: Question[];
}
