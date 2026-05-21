export interface CyrillicLetter {
  char: string;
  latin: string;
  name: string;
  nameRu: string;
  category: 'vowels' | 'basic-consonants' | 'soft-hard-consonants' | 'special';
  audioUrl?: string;
}

export interface LetterGroup {
  id: string;
  title: string;
  titleRu: string;
  letters: CyrillicLetter[];
}

export type GameScreen = 'menu' | 'selection' | 'quiz' | 'reference' | 'stories' | 'dictionary';

export type GameTheme = 'dark' | 'light' | 'sakura' | 'forest';
export type FontStyle = 'noto-sans' | 'hina-mincho' | 'random';
export type AutoSubmitSetting = 'never' | 'correct' | 'always';

export interface GameSettings {
  autoSubmit: AutoSubmitSetting;
  requeueIncorrect: boolean;
  showXOnMismatch: boolean;
  showProgressBar: boolean;
  confettiOnCorrect: boolean;
  theme: GameTheme;
  fontStyle: FontStyle;
  interfaceVolume: number;
  voiceVolume: number;
  language: 'es' | 'en';
}

export interface QuizState {
  currentLetters: CyrillicLetter[];
  currentIndex: number;
  score: number;
  totalAnswered: number;
  streak: number;
  bestStreak: number;
  inputValue: string;
  showCorrect: boolean;
  isCorrect: boolean;
  correctAnswer: string;
}

