import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useGameStore } from '@/hooks/useGameStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, RotateCcw, Check, Volume2, Home, Settings, X } from 'lucide-react';
import Confetti from '@/components/Confetti';
import type { CyrillicLetter } from '@/types/cyrillic';

export default function QuizScreen() {
  const { setScreen, goBack, quizLetters, settings, setSettingsOpen, isSettingsOpen, t } = useGameStore();
  
  // Game states
  const [lettersQueue, setLettersQueue] = useState<CyrillicLetter[]>([]);
  const [index, setIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize active queue
  useEffect(() => {
    if (quizLetters && quizLetters.length > 0) {
      setLettersQueue([...quizLetters]);
      setIndex(0);
      setInputValue('');
      setScore(0);
      setTotalAnswered(0);
      setStreak(0);
      setBestStreak(0);
      setShowResult(false);
      setIsCorrect(false);
      setQuizFinished(false);
      setShowConfetti(false);
    }
  }, [quizLetters]);

  const currentLetter = lettersQueue[index];

  // Auto-focus input on mount or state change
  useEffect(() => {
    if (inputRef.current && !showResult && !quizFinished) {
      inputRef.current.focus();
    }
  }, [index, showResult, quizFinished]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Pronunciation player using human audioUrl when available, falling back to Google TTS
  const speakLetter = useCallback((target: CyrillicLetter | string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    let url = '';
    let cleanText = '';

    if (typeof target === 'string') {
      cleanText = target.trim();
      if (!cleanText) return;
      url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ru&client=tw-ob&q=${encodeURIComponent(cleanText)}`;
    } else if (target && typeof target === 'object') {
      cleanText = target.nameRu.trim();
      url = target.audioUrl || `https://translate.google.com/translate_tts?ie=UTF-8&tl=ru&client=tw-ob&q=${encodeURIComponent(cleanText)}`;
    }

    if (!url) return;

    const audio = new Audio();
    audio.referrerPolicy = "no-referrer";
    audio.src = url;
    audio.volume = settings.voiceVolume / 100;
    audioRef.current = audio;

    audio.play().catch((err) => {
      console.warn('First audio attempt failed:', err);
      // Fallback: If wikimedia .ogg failed, try Google TTS
      if (typeof target === 'object' && target.audioUrl && url === target.audioUrl) {
        console.log('Falling back to Google TTS for letter pronunciation');
        const fallbackUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ru&client=tw-ob&q=${encodeURIComponent(cleanText)}`;
        const fallbackAudio = new Audio();
        fallbackAudio.referrerPolicy = "no-referrer";
        fallbackAudio.src = fallbackUrl;
        fallbackAudio.volume = settings.voiceVolume / 100;
        audioRef.current = fallbackAudio;
        fallbackAudio.play().catch((err2) => {
          console.warn('Google TTS fallback also failed:', err2);
          if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.lang = 'ru-RU';
            utterance.rate = 0.8;
            window.speechSynthesis.speak(utterance);
          }
        });
      } else {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.lang = 'ru-RU';
          utterance.rate = 0.8;
          window.speechSynthesis.speak(utterance);
        }
      }
    });
  }, [settings.voiceVolume]);

  const handlePlayAudioClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (currentLetter) {
      speakLetter(currentLetter);
    }
    // Refocus input field so writing is not interrupted
    setTimeout(() => {
      inputRef.current?.focus();
    }, 10);
  }, [currentLetter, speakLetter]);

  const checkAnswer = useCallback(() => {
    if (!inputValue.trim() || showResult || !currentLetter) return;

    const answer = inputValue.trim().toLowerCase();
    const correct = currentLetter.latin.toLowerCase();
    const correctAnswers = correct.split(',').map((a) => a.trim());
    const gotItRight = correctAnswers.includes(answer);

    setIsCorrect(gotItRight);
    setShowResult(true);
    setTotalAnswered((prev) => prev + 1);

    if (gotItRight) {
      setScore((prev) => prev + 1);
      setStreak((prev) => {
        const newStreak = prev + 1;
        setBestStreak((best) => Math.max(best, newStreak));
        return newStreak;
      });
      speakLetter(currentLetter);
      
      if (settings.confettiOnCorrect) {
        setShowConfetti(true);
      }
    } else {
      setStreak(0);
      speakLetter(currentLetter);
      
      // If requeue is enabled, add this letter to the back of the queue
      if (settings.requeueIncorrect) {
        setLettersQueue((prev) => [...prev, currentLetter]);
      }
    }
  }, [inputValue, showResult, currentLetter, speakLetter, settings.confettiOnCorrect, settings.requeueIncorrect]);

  const nextLetter = useCallback(() => {
    setShowConfetti(false);
    if (index >= lettersQueue.length - 1) {
      setQuizFinished(true);
    } else {
      setIndex((prev) => prev + 1);
      setInputValue('');
      setShowResult(false);
      setIsCorrect(false);
    }
  }, [index, lettersQueue.length]);

  // Handle auto-submit behaviors
  useEffect(() => {
    if (showResult || quizFinished || !currentLetter) return;
    
    const val = inputValue.trim().toLowerCase();
    if (!val) return;

    const correctAnswers = currentLetter.latin.toLowerCase().split(',').map((a) => a.trim());
    
    // Auto submit if correct
    if (settings.autoSubmit === 'correct' && correctAnswers.includes(val)) {
      checkAnswer();
      return;
    }

    // Auto submit always (when input length matches correct answer length)
    if (settings.autoSubmit === 'always') {
      const minCorrectLength = Math.min(...correctAnswers.map((a) => a.length));
      if (val.length >= minCorrectLength) {
        checkAnswer();
      }
    }
  }, [inputValue, currentLetter, settings.autoSubmit, showResult, quizFinished, checkAnswer]);

  // Global keyboard and hotkeys listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (quizFinished || isSettingsOpen) return;

      // Ctrl+Space to hear pronunciation immediately
      if (e.ctrlKey && e.key === ' ') {
        e.preventDefault();
        if (currentLetter) {
          speakLetter(currentLetter);
        }
        return;
      }

      if (e.key === 'Enter') {
        // If the user is focusing a button, let the default behavior click the button
        if (document.activeElement && document.activeElement.tagName === 'BUTTON') {
          return;
        }

        e.preventDefault();
        if (showResult) {
          nextLetter();
        } else {
          checkAnswer();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [showResult, quizFinished, isSettingsOpen, currentLetter, speakLetter, nextLetter, checkAnswer]);

  const restartQuiz = useCallback(() => {
    setLettersQueue([...quizLetters]);
    setIndex(0);
    setInputValue('');
    setScore(0);
    setTotalAnswered(0);
    setStreak(0);
    setBestStreak(0);
    setShowResult(false);
    setIsCorrect(false);
    setQuizFinished(false);
    setShowConfetti(false);
  }, [quizLetters]);

  // Real-time mismatch validation
  const isMismatch = useMemo(() => {
    if (!settings.showXOnMismatch || !inputValue.trim() || showResult || !currentLetter) return false;
    const val = inputValue.trim().toLowerCase();
    const correctList = currentLetter.latin.toLowerCase().split(',').map((a) => a.trim());
    return !correctList.some((ans) => ans.startsWith(val));
  }, [inputValue, currentLetter, showResult, settings.showXOnMismatch]);

  if (!currentLetter && !quizFinished) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Quiz End Screen
  if (quizFinished) {
    const accuracy = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md w-full animate-fade-in space-y-8">
          <div>
            <h2 className="text-3xl font-extrabold text-foreground mb-4">Quiz Completado</h2>
            <div className="text-7xl font-extrabold text-primary mb-2">
              {accuracy}%
            </div>
            <p className="text-muted-foreground text-sm font-semibold uppercase tracking-wider">{t('quiz.accuracy')}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-md">
              <div className="text-3xl font-bold text-primary">{score}</div>
              <div className="text-xs text-muted-foreground font-semibold mt-1">{t('quiz.correct')}</div>
            </div>
            <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-md">
              <div className="text-3xl font-bold text-rose-500">
                {totalAnswered - score}
              </div>
              <div className="text-xs text-muted-foreground font-semibold mt-1">{t('quiz.wrong')}</div>
            </div>
            <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-md">
              <div className="text-3xl font-bold text-secondary">{bestStreak}</div>
              <div className="text-xs text-muted-foreground font-semibold mt-1">{t('quiz.bestStreak')}</div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={restartQuiz}
              className="flex-1 h-14 bg-primary hover:bg-primary/95 text-primary-foreground font-bold rounded-xl shadow-md shadow-primary/20"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {t('quiz.retry')}
            </Button>
            <Button
              onClick={() => setScreen('menu')}
              variant="outline"
              className="h-14 px-6 border-border text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl font-bold"
            >
              <Home className="w-4 h-4 mr-2" />
              {t('quiz.menu')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Gameplay Screen
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
      {/* Canvas Confetti Animation */}
      <Confetti active={showConfetti} />

      {/* Settings gear on the top right */}
      <div className="absolute top-6 right-6">
        <Button
          onClick={() => setSettingsOpen(true)}
          variant="outline"
          size="icon"
          className="h-10 w-10 border-border text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      <div className="w-full max-w-lg space-y-6">
        {/* Progress Counters */}
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-muted-foreground/80">
            {index + 1} / {lettersQueue.length}
          </div>
          <div className="flex items-center gap-3 text-sm font-bold">
            <span className="text-primary">
              {score} {t('quiz.correctCount')}
            </span>
            <span className="text-border">|</span>
            <span className="text-secondary">
              {t('quiz.streak')}: {streak}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        {settings.showProgressBar && (
          <div className="w-full h-2 bg-muted border border-border/40 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
              style={{ width: `${((index + 1) / lettersQueue.length) * 100}%` }}
            />
          </div>
        )}

        {/* Character display */}
        <div className="text-center py-6">
          <button
            type="button"
            onClick={handlePlayAudioClick}
            className="text-8xl font-black text-foreground hover:text-primary transition-colors inline-flex items-baseline gap-4 cursor-pointer font-cyrillic"
            title={t('quiz.typeHear')}
          >
            {currentLetter.char.toLowerCase()}
            <Volume2 className="w-7 h-7 text-muted-foreground hover:text-primary transition-colors" />
          </button>
        </div>

        {/* Input Field */}
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t('quiz.placeholder')}
            readOnly={showResult}
            className={`
              w-full h-16 text-center text-xl bg-card border-2 rounded-2xl
              placeholder:text-muted-foreground/50 text-foreground font-semibold
              focus:outline-hidden focus:ring-0
              ${
                showResult
                  ? isCorrect
                    ? 'border-primary bg-primary/10'
                    : 'border-rose-500 bg-rose-500/10'
                  : isMismatch
                  ? 'border-rose-500 bg-rose-500/5 focus:border-rose-500'
                  : 'border-border focus:border-primary/50'
              }
            `}
          />
          {/* Action icon markers on the right */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
            {showResult ? (
              isCorrect ? (
                <Check className="w-6 h-6 text-primary" />
              ) : (
                <span className="text-rose-500 font-bold text-base font-mono pr-1">{currentLetter.latin}</span>
              )
            ) : isMismatch ? (
              <X className="w-6 h-6 text-rose-500 animate-pulse" />
            ) : null}
          </div>
        </div>

        {/* Result message banner */}
        {showResult && (
          <div
            className={`text-center py-3.5 px-4 rounded-xl text-sm font-bold border animate-fade-in ${
              isCorrect
                ? 'bg-primary/10 border-primary/20 text-primary'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
            }`}
          >
            {isCorrect 
              ? t('quiz.correctResult') 
              : t('quiz.incorrectResult', { latin: currentLetter.latin })}
          </div>
        )}

        {/* Info Helper Text */}
        <p className="text-[11px] text-muted-foreground/60 text-center font-medium">
          {t('quiz.typeHear')}
        </p>

        {/* Controls Toolbar */}
        <div className="flex justify-center gap-4 pt-4">
          <Button
            onClick={goBack}
            variant="outline"
            size="icon"
            className="h-14 w-14 border-border text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl"
            title={t('selection.back')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          {showResult ? (
            <Button
              onClick={nextLetter}
              className="h-14 px-10 bg-primary hover:bg-primary/95 text-primary-foreground font-bold rounded-xl shadow-md shadow-primary/20 flex-1"
            >
              {t('quiz.next')}
            </Button>
          ) : (
            <Button
              onClick={checkAnswer}
              disabled={!inputValue.trim()}
              className="h-14 px-10 bg-primary hover:bg-primary/95 text-primary-foreground font-bold rounded-xl shadow-md shadow-primary/20 flex-1 disabled:opacity-50"
            >
              {t('quiz.check')}
            </Button>
          )}

          <Button
            onClick={restartQuiz}
            variant="outline"
            size="icon"
            className="h-14 w-14 border-border text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl"
            title={t('quiz.retry')}
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
