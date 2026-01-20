import { categoryData, allQuestionIds, isMatch, getMatchStrength, Question } from './questions';

export interface MatchResult {
  question: Question;
  answerA: number;
  answerB: number;
  strength: 'perfect' | 'good';
}

export interface MatchSummary {
  totalMatches: number;
  perfectMatches: number;
  goodMatches: number;
  matchesByCategory: Record<string, MatchResult[]>;
  allMatches: MatchResult[];
  compatibilityScore: number;
}

export function calculateMatches(
  answersA: Record<string, number>,
  answersB: Record<string, number>
): MatchSummary {
  const allMatches: MatchResult[] = [];
  const matchesByCategory: Record<string, MatchResult[]> = {};

  // Initialize categories
  categoryData.forEach((cat) => {
    matchesByCategory[cat.id] = [];
  });

  // Find all matches
  allQuestionIds.forEach((question) => {
    const answerA = answersA[question.id];
    const answerB = answersB[question.id];

    if (answerA !== undefined && answerB !== undefined && isMatch(answerA, answerB)) {
      const strength = getMatchStrength(answerA, answerB);
      if (strength !== 'none') {
        const match: MatchResult = {
          question,
          answerA,
          answerB,
          strength,
        };
        allMatches.push(match);
        matchesByCategory[question.category].push(match);
      }
    }
  });

  // Sort matches: perfect matches first, then by category
  allMatches.sort((a, b) => {
    if (a.strength === 'perfect' && b.strength !== 'perfect') return -1;
    if (a.strength !== 'perfect' && b.strength === 'perfect') return 1;
    return 0;
  });

  const perfectMatches = allMatches.filter((m) => m.strength === 'perfect').length;
  const goodMatches = allMatches.filter((m) => m.strength === 'good').length;

  // Calculate compatibility score (percentage of questions where both were positive)
  const answeredBothCount = Object.keys(answersA).filter(
    (key) => answersA[key] !== undefined && answersB[key] !== undefined
  ).length;

  const compatibilityScore =
    answeredBothCount > 0 ? Math.round((allMatches.length / answeredBothCount) * 100) : 0;

  return {
    totalMatches: allMatches.length,
    perfectMatches,
    goodMatches,
    matchesByCategory,
    allMatches,
    compatibilityScore,
  };
}

// Get teaser matches (free preview)
export function getTeaserMatches(matches: MatchResult[], count: number = 8): MatchResult[] {
  const perfect = matches.filter((m) => m.strength === 'perfect');
  const good = matches.filter((m) => m.strength === 'good');

  const teaser: MatchResult[] = [];

  // Add up to 5 perfect matches (increased from 3)
  teaser.push(...perfect.slice(0, Math.min(5, count)));

  // Fill remaining with good matches
  const remaining = count - teaser.length;
  if (remaining > 0) {
    teaser.push(...good.slice(0, remaining));
  }

  return teaser;
}

// Get category emoji by ID
export function getCategoryEmoji(categoryId: string): string {
  const category = categoryData.find((c) => c.id === categoryId);
  return category?.emoji || '';
}
