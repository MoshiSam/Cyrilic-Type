import { useState, useRef, useEffect, useMemo } from 'react';
import { useGameStore } from '@/hooks/useGameStore';
import { Button } from '@/components/ui/button';
import { dictionary, type DictionaryEntry } from '@/data/dictionaryData';
import { transliterate } from '@/lib/transliterate';
import { ArrowLeft, Search, Volume2, Globe, Settings, X, BookOpen } from 'lucide-react';

export default function DictionaryScreen() {
  const { setScreen, settings, setSettingsOpen, t } = useGameStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Online translation states
  const [onlineResult, setOnlineResult] = useState<DictionaryEntry | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [onlineError, setOnlineError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const playAudio = (text: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const cleanText = text.trim();
    if (!cleanText) return;

    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ru&client=tw-ob&q=${encodeURIComponent(cleanText)}`;
    const audio = new Audio();
    (audio as any).referrerPolicy = "no-referrer";
    audio.src = ttsUrl;
    audio.volume = settings.voiceVolume / 100;
    audioRef.current = audio;

    audio.play().catch((err) => {
      console.warn('Google TTS failed, using Web Speech Synthesis fallback', err);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'ru-RU';
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
      }
    });
  };

  // Filter local dictionary
  const filteredWords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    
    return dictionary.filter((entry) => {
      // Category match
      const categoryMatch = selectedCategory === 'all' || entry.cat === selectedCategory;
      if (!categoryMatch) return false;

      if (!query) return true;

      // Search match
      return (
        entry.ru.toLowerCase().includes(query) ||
        entry.es.toLowerCase().includes(query) ||
        entry.lat.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, selectedCategory]);

  // Online translate logic
  const performOnlineTranslation = async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) {
      setOnlineResult(null);
      setOnlineError(null);
      return;
    }

    setIsTranslating(true);
    setOnlineError(null);

    try {
      const isCyrillic = /[а-яА-ЯёЁ]/.test(trimmed);
      const sl = isCyrillic ? 'ru' : 'es';
      const tl = isCyrillic ? 'es' : 'ru';
      
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(trimmed)}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network error');
      
      const data = await response.json();
      if (data && data[0] && data[0][0] && data[0][0][0]) {
        const translatedText = data[0][0][0];
        
        let ruWord = '';
        let esWord = '';
        let latWord = '';
        
        if (isCyrillic) {
          ruWord = trimmed;
          esWord = translatedText;
          latWord = transliterate(trimmed);
        } else {
          ruWord = translatedText;
          esWord = trimmed;
          latWord = transliterate(translatedText);
        }

        setOnlineResult({
          ru: ruWord,
          es: esWord,
          lat: latWord,
          cat: 'common'
        });
      } else {
        setOnlineResult(null);
      }
    } catch (e) {
      console.error('Online translation error', e);
      setOnlineError(t('dictionary.onlineError') || 'Error al conectar con el traductor.');
    } finally {
      setIsTranslating(false);
    }
  };

  // Debounced search trigger for Google Translate when no local results exist
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (!searchQuery.trim()) {
      setOnlineResult(null);
      setOnlineError(null);
      return;
    }

    // Only run online translation if no local matches found
    if (filteredWords.length === 0) {
      debounceTimer.current = setTimeout(() => {
        performOnlineTranslation(searchQuery);
      }, 600);
    } else {
      setOnlineResult(null);
    }

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchQuery, filteredWords.length]);

  // Categories metadata with count
  const categoriesList = useMemo(() => {
    const list = [
      { id: 'all', label: t('dictionary.cat.all') },
      { id: 'greetings', label: t('dictionary.cat.greetings') },
      { id: 'numbers', label: t('dictionary.cat.numbers') },
      { id: 'colors', label: t('dictionary.cat.colors') },
      { id: 'pronouns', label: t('dictionary.cat.pronouns') },
      { id: 'questions', label: t('dictionary.cat.questions') },
      { id: 'family', label: t('dictionary.cat.family') },
      { id: 'food', label: t('dictionary.cat.food') },
      { id: 'verbs', label: t('dictionary.cat.verbs') },
      { id: 'time', label: t('dictionary.cat.time') },
      { id: 'common', label: t('dictionary.cat.common') }
    ];

    return list.map((cat) => {
      const count = cat.id === 'all' 
        ? dictionary.length 
        : dictionary.filter(w => w.cat === cat.id).length;
      return { ...cat, count };
    });
  }, [t]);

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setScreen('selection')}
            variant="outline"
            size="icon"
            className="h-10 w-10 border-border text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl animate-fade-in"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
              <BookOpen className="w-7 h-7" />
              {t('dictionary.title')}
            </h2>
          </div>

          <Button
            onClick={() => setSettingsOpen(true)}
            variant="outline"
            size="icon"
            className="h-10 w-10 border-border text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Search Bar Panel */}
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('dictionary.searchPlaceholder')}
              className="w-full h-12 pl-11 pr-10 bg-background border border-border rounded-xl placeholder:text-muted-foreground/80 focus:border-primary focus:ring-0 focus:outline-hidden text-base font-medium transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Categories Pill List */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin scrollbar-thumb-muted">
            {categoriesList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border shrink-0 transition-all duration-200
                  ${
                    selectedCategory === cat.id
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-background hover:bg-muted text-muted-foreground border-border/50'
                  }
                `}
              >
                <span>{cat.label}</span>
                <span 
                  className={`
                    px-1.5 py-0.5 rounded-full text-[10px]
                    ${selectedCategory === cat.id ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'}
                  `}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center px-1 text-xs text-muted-foreground">
          <span>
            {searchQuery 
              ? `${filteredWords.length} resultados encontrados` 
              : `Mostrando ${filteredWords.length} de ${dictionary.length} palabras locales`}
          </span>
          {selectedCategory !== 'all' && (
            <button 
              onClick={() => setSelectedCategory('all')} 
              className="hover:underline text-primary font-medium"
            >
              Limpiar categoría
            </button>
          )}
        </div>

        {/* Results List */}
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
          {filteredWords.map((entry, idx) => (
            <div 
              key={idx}
              className="group bg-card border border-border/70 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 hover:border-primary/50 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <button
                  onClick={() => playAudio(entry.ru)}
                  className="p-3 rounded-xl bg-background hover:bg-primary/15 text-muted-foreground hover:text-primary transition-all border border-border/50 shadow-xs shrink-0"
                  title="Escuchar audio"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                
                <div className="space-y-0.5 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="text-xl font-bold text-foreground tracking-wide font-cyrillic break-all">
                      {entry.ru}
                    </span>
                    <span className="text-xs font-semibold text-secondary/90 italic font-mono break-all">
                      [{entry.lat}]
                    </span>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed break-words">
                    {entry.es}
                  </p>
                </div>
              </div>
              
              <div className="shrink-0 flex items-center pl-[60px] sm:pl-0">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-muted text-muted-foreground border border-border/20">
                  {t(`dictionary.cat.${entry.cat}`)}
                </span>
              </div>
            </div>
          ))}

          {/* Local results empty & online search triggers */}
          {filteredWords.length === 0 && (
            <div className="bg-card border border-border/70 rounded-xl p-8 text-center space-y-4">
              {isTranslating ? (
                <div className="space-y-3 py-4">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('dictionary.onlineTranslating')}
                  </p>
                </div>
              ) : onlineResult ? (
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider border-b border-border/60 pb-2">
                    <Globe className="w-4 h-4" />
                    <span>{t('dictionary.onlineTranslation')}</span>
                  </div>

                  <div className="flex items-center justify-between bg-background p-4 rounded-xl border border-border/60 shadow-inner">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => playAudio(onlineResult.ru)}
                        className="p-3 rounded-xl bg-card hover:bg-primary/15 text-muted-foreground hover:text-primary transition-all border border-border/60"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-foreground font-cyrillic">
                            {onlineResult.ru}
                          </span>
                          <span className="text-xs font-semibold text-secondary/90 italic font-mono">
                            [{onlineResult.lat}]
                          </span>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {onlineResult.es}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 py-4">
                  <BookOpen className="w-12 h-12 text-muted-foreground/35 mx-auto" />
                  <p className="text-base font-semibold text-foreground">
                    {t('dictionary.noResults')}
                  </p>
                  {onlineError ? (
                    <p className="text-xs text-rose-500">{onlineError}</p>
                  ) : searchQuery.trim() ? (
                    <p className="text-xs text-muted-foreground">
                      No hay coincidencias locales para "{searchQuery}". Pruebe otra palabra.
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Comience a escribir para buscar en el diccionario.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
