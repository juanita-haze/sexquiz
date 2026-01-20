export interface Question {
  id: string;
  category: string;
}

export interface Category {
  id: string;
  emoji: string;
  questions: Question[];
}

// Question IDs mapped to categories - actual text comes from translations
export const categoryData: Category[] = [
  {
    id: 'basics',
    emoji: '💕',
    questions: [
      { id: 'b1', category: 'basics' },
      { id: 'b2', category: 'basics' },
      { id: 'b3', category: 'basics' },
      { id: 'b4', category: 'basics' },
      { id: 'b5', category: 'basics' },
      { id: 'b6', category: 'basics' },
      { id: 'b7', category: 'basics' },
      { id: 'b8', category: 'basics' },
      { id: 'b9', category: 'basics' },
      { id: 'b10', category: 'basics' },
      { id: 'b11', category: 'basics' },
      { id: 'b12', category: 'basics' },
      { id: 'b13', category: 'basics' },
      { id: 'b14', category: 'basics' },
      { id: 'b15', category: 'basics' },
      { id: 'b16', category: 'basics' },
    ],
  },
  {
    id: 'roleplay',
    emoji: '🎭',
    questions: [
      { id: 'r1', category: 'roleplay' },
      { id: 'r2', category: 'roleplay' },
      { id: 'r3', category: 'roleplay' },
      { id: 'r4', category: 'roleplay' },
      { id: 'r5', category: 'roleplay' },
      { id: 'r6', category: 'roleplay' },
      { id: 'r7', category: 'roleplay' },
      { id: 'r8', category: 'roleplay' },
      { id: 'r9', category: 'roleplay' },
      { id: 'r10', category: 'roleplay' },
    ],
  },
  {
    id: 'anal',
    emoji: '🍑',
    questions: [
      { id: 'a1', category: 'anal' },
      { id: 'a2', category: 'anal' },
      { id: 'a3', category: 'anal' },
      { id: 'a4', category: 'anal' },
      { id: 'a5', category: 'anal' },
      { id: 'a6', category: 'anal' },
      { id: 'a7', category: 'anal' },
    ],
  },
  {
    id: 'positions',
    emoji: '🔄',
    questions: [
      { id: 'p1', category: 'positions' },
      { id: 'p2', category: 'positions' },
      { id: 'p3', category: 'positions' },
      { id: 'p4', category: 'positions' },
      { id: 'p5', category: 'positions' },
      { id: 'p6', category: 'positions' },
      { id: 'p7', category: 'positions' },
      { id: 'p8', category: 'positions' },
      { id: 'p9', category: 'positions' },
    ],
  },
  {
    id: 'bdsm',
    emoji: '⛓️',
    questions: [
      { id: 'd1', category: 'bdsm' },
      { id: 'd2', category: 'bdsm' },
      { id: 'd3', category: 'bdsm' },
      { id: 'd4', category: 'bdsm' },
      { id: 'd5', category: 'bdsm' },
      { id: 'd6', category: 'bdsm' },
      { id: 'd7', category: 'bdsm' },
      { id: 'd8', category: 'bdsm' },
      { id: 'd9', category: 'bdsm' },
      { id: 'd10', category: 'bdsm' },
      { id: 'd11', category: 'bdsm' },
      { id: 'd12', category: 'bdsm' },
      { id: 'd13', category: 'bdsm' },
      { id: 'd14', category: 'bdsm' },
      { id: 'd15', category: 'bdsm' },
      { id: 'd16', category: 'bdsm' },
      { id: 'd17', category: 'bdsm' },
      { id: 'd18', category: 'bdsm' },
      { id: 'd19', category: 'bdsm' },
      { id: 'd20', category: 'bdsm' },
    ],
  },
  {
    id: 'frequency',
    emoji: '📍',
    questions: [
      { id: 'f1', category: 'frequency' },
      { id: 'f2', category: 'frequency' },
      { id: 'f3', category: 'frequency' },
      { id: 'f4', category: 'frequency' },
      { id: 'f5', category: 'frequency' },
      { id: 'f6', category: 'frequency' },
      { id: 'f7', category: 'frequency' },
      { id: 'f8', category: 'frequency' },
      { id: 'f9', category: 'frequency' },
      { id: 'f10', category: 'frequency' },
      { id: 'f11', category: 'frequency' },
      { id: 'f12', category: 'frequency' },
      { id: 'f13', category: 'frequency' },
      { id: 'f14', category: 'frequency' },
    ],
  },
  {
    id: 'toys',
    emoji: '🎮',
    questions: [
      { id: 't1', category: 'toys' },
      { id: 't2', category: 'toys' },
      { id: 't3', category: 'toys' },
      { id: 't4', category: 'toys' },
      { id: 't5', category: 'toys' },
      { id: 't6', category: 'toys' },
      { id: 't7', category: 'toys' },
    ],
  },
  {
    id: 'body',
    emoji: '👅',
    questions: [
      { id: 'o1', category: 'body' },
      { id: 'o2', category: 'body' },
      { id: 'o3', category: 'body' },
      { id: 'o4', category: 'body' },
      { id: 'o5', category: 'body' },
      { id: 'o6', category: 'body' },
    ],
  },
  {
    id: 'group',
    emoji: '👥',
    questions: [
      { id: 'g1', category: 'group' },
      { id: 'g2', category: 'group' },
      { id: 'g3', category: 'group' },
      { id: 'g4', category: 'group' },
      { id: 'g5', category: 'group' },
      { id: 'g6', category: 'group' },
      { id: 'g7', category: 'group' },
      { id: 'g8', category: 'group' },
    ],
  },
  {
    id: 'bonus',
    emoji: '🔥',
    questions: [
      { id: 'x1', category: 'bonus' },
      { id: 'x2', category: 'bonus' },
      { id: 'x3', category: 'bonus' },
      { id: 'x4', category: 'bonus' },
      { id: 'x5', category: 'bonus' },
      { id: 'x6', category: 'bonus' },
      { id: 'x7', category: 'bonus' },
      { id: 'x8', category: 'bonus' },
      { id: 'x9', category: 'bonus' },
      { id: 'x10', category: 'bonus' },
      { id: 'x11', category: 'bonus' },
      { id: 'x12', category: 'bonus' },
      { id: 'x13', category: 'bonus' },
    ],
  },
];

export const allQuestionIds: Question[] = categoryData.flatMap((cat) => cat.questions);

export const TOTAL_QUESTIONS = allQuestionIds.length;

// Quick quiz: 30 essential questions (most popular, less extreme)
export const quickQuizQuestionIds = new Set([
  // Basics (8) - everyday desires
  'b1', 'b2', 'b3', 'b4', 'b5', 'b7', 'b11', 'b14',
  // Roleplay (4) - fun and accessible
  'r1', 'r6', 'r7', 'r10',
  // Anal (2) - just the basics
  'a1', 'a2',
  // Positions (4) - common positions
  'p1', 'p2', 'p3', 'p9',
  // BDSM (5) - lighter options
  'd1', 'd2', 'd4', 'd5', 'd7',
  // Location (3) - fun settings
  'f4', 'f7', 'f9',
  // Toys (2) - most popular
  't1', 't7',
  // Body (2) - general preferences
  'o4', 'o6',
]);

export const QUICK_QUIZ_TOTAL = quickQuizQuestionIds.size;

// Get categories filtered for quick quiz
export function getQuickQuizCategories(): Category[] {
  return categoryData
    .map((cat) => ({
      ...cat,
      questions: cat.questions.filter((q) => quickQuizQuestionIds.has(q.id)),
    }))
    .filter((cat) => cat.questions.length > 0);
}

// Answer options with emojis (labels come from translations)
export const answerOptionValues = [
  { value: 1, emoji: '🤮' },
  { value: 2, emoji: '😕' },
  { value: 3, emoji: '🤷' },
  { value: 4, emoji: '😀' },
  { value: 5, emoji: '😍' },
];

// Function to check if two answers are a match (both positive)
export function isMatch(answerA: number, answerB: number): boolean {
  return answerA >= 4 && answerB >= 4;
}

// Function to get match strength
export function getMatchStrength(answerA: number, answerB: number): 'perfect' | 'good' | 'none' {
  if (answerA === 5 && answerB === 5) return 'perfect';
  if (answerA >= 4 && answerB >= 4) return 'good';
  return 'none';
}

// Helper to get category info by ID
export function getCategoryById(categoryId: string): Category | undefined {
  return categoryData.find((c) => c.id === categoryId);
}
