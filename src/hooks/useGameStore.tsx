import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { GameScreen, CyrillicLetter, GameSettings } from '@/types/cyrillic';
import { allLetters } from '@/data/cyrillicData';
import { translations } from '@/data/translations';

interface GameStore {
  screen: GameScreen;
  setScreen: (screen: GameScreen) => void;
  goBack: () => void;
  selectedGroups: string[];
  toggleGroup: (groupId: string) => void;
  selectAllGroups: () => void;
  deselectAllGroups: () => void;
  quizLetters: CyrillicLetter[];
  startQuiz: () => void;
  settings: GameSettings;
  updateSettings: (newSettings: Partial<GameSettings>) => void;
  isSettingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  t: (key: string, replacements?: Record<string, string>) => string;
}

const DEFAULT_SETTINGS: GameSettings = {
  autoSubmit: 'never',
  requeueIncorrect: true,
  showXOnMismatch: false,
  showProgressBar: true,
  confettiOnCorrect: true,
  theme: 'dark',
  fontStyle: 'noto-sans',
  interfaceVolume: 80,
  voiceVolume: 80,
  language: 'es',
};

const GameContext = createContext<GameStore | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [screenHistory, setScreenHistory] = useState<GameScreen[]>(['menu']);
  const screen = screenHistory[screenHistory.length - 1] || 'menu';

  const setScreen = useCallback((newScreen: GameScreen) => {
    setScreenHistory((prev) => {
      if (newScreen === 'menu') {
        return ['menu'];
      }
      if (prev[prev.length - 1] === newScreen) return prev;
      return [...prev, newScreen];
    });
  }, []);

  const goBack = useCallback(() => {
    setScreenHistory((prev) => {
      if (prev.length <= 1) return ['menu'];
      return prev.slice(0, -1);
    });
  }, []);

  const [selectedGroups, setSelectedGroups] = useState<string[]>(['vowels', 'basic-consonants']);
  const [quizLetters, setQuizLetters] = useState<CyrillicLetter[]>([]);
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  // Helper functions for cookie handling
  const getCookie = (name: string): string | null => {
    try {
      const nameEQ = name + "=";
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    } catch (e) {
      console.error('Error reading cookie', e);
    }
    return null;
  };

  const setCookie = (name: string, value: string, days = 365) => {
    try {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      const expires = "; expires=" + date.toUTCString();
      document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/; SameSite=Lax";
    } catch (e) {
      console.error('Error writing cookie', e);
    }
  };

  // Load settings from cookie (with localStorage fallback for extra resilience)
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      let stored = getCookie('cyrillic_type_settings');
      if (!stored) {
        stored = localStorage.getItem('cyrillic_type_settings');
      }
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (e) {
      console.error('Error loading settings', e);
    }
    return DEFAULT_SETTINGS;
  });

  // Apply theme and font style when settings change
  useEffect(() => {
    // 1. Theme application
    const root = document.documentElement;
    root.setAttribute('data-theme', settings.theme);
    
    // Manage body classes for tailwind theme if needed
    if (settings.theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }

    // 2. Font style application
    root.classList.remove('font-noto', 'font-hina', 'font-random');
    if (settings.fontStyle === 'noto-sans') {
      root.classList.add('font-noto');
    } else if (settings.fontStyle === 'hina-mincho') {
      root.classList.add('font-hina');
    } else {
      root.classList.add('font-random');
    }
  }, [settings.theme, settings.fontStyle]);

  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        const serialized = JSON.stringify(updated);
        setCookie('cyrillic_type_settings', serialized);
        localStorage.setItem('cyrillic_type_settings', serialized);
      } catch (e) {
        console.error('Error saving settings', e);
      }
      return updated;
    });
  }, []);

  const toggleGroup = useCallback((groupId: string) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    );
  }, []);

  const selectAllGroups = useCallback(() => {
    setSelectedGroups(['vowels', 'basic-consonants', 'soft-hard-signs']);
  }, []);

  const deselectAllGroups = useCallback(() => {
    setSelectedGroups([]);
  }, []);

  const startQuiz = useCallback(() => {
    const groups = ['vowels', 'basic-consonants', 'soft-hard-signs'];
    const letters = allLetters.filter((l) => {
      const groupId = groups.find((g) =>
        g === 'vowels'
          ? l.category === 'vowels'
          : g === 'basic-consonants'
            ? l.category === 'basic-consonants'
            : l.category === 'special'
      );
      return groupId && selectedGroups.includes(groupId);
    });

    if (letters.length === 0) return;

    // Shuffle letters
    const shuffled = [...letters].sort(() => Math.random() - 0.5);
    setQuizLetters(shuffled);
    setScreen('quiz');
  }, [selectedGroups]);

  // Translation helper
  const t = useCallback(
    (key: string, replacements?: Record<string, string>) => {
      const lang = settings.language;
      const langDict = translations[lang] || translations.es;
      let val = langDict[key as keyof typeof langDict] || translations.es[key as keyof typeof translations.es] || key;
      
      if (replacements) {
        Object.entries(replacements).forEach(([k, v]) => {
          val = val.replace(`{${k}}`, v);
        });
      }
      return val;
    },
    [settings.language]
  );

  return (
    <GameContext.Provider
      value={{
        screen,
        setScreen,
        goBack,
        selectedGroups,
        toggleGroup,
        selectAllGroups,
        deselectAllGroups,
        quizLetters,
        startQuiz,
        settings,
        updateSettings,
        isSettingsOpen,
        setSettingsOpen,
        t,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameStore() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGameStore must be used within GameProvider');
  return context;
}

