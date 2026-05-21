import { useState, useRef, useEffect } from 'react';
import { useGameStore } from '@/hooks/useGameStore';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Volume2, Sparkles, BookOpen, Languages, Link, ArrowRight, Settings } from 'lucide-react';
import { stories } from '@/data/storiesData';
import { transliterate } from '@/lib/transliterate';

const splitIntoChunks = (text: string, maxLen = 150): string[] => {
  // Split by sentence endings first, preserving the punctuation
  const regex = /([^.!?]+[.!?]*)/g;
  const matches = text.match(regex) || [text];
  
  const chunks: string[] = [];
  let currentChunk = "";
  
  for (const match of matches) {
    const trimmed = match.trim();
    if (!trimmed) continue;
    
    if (currentChunk && (currentChunk.length + trimmed.length + 1 > maxLen)) {
      chunks.push(currentChunk);
      currentChunk = trimmed;
    } else {
      currentChunk = currentChunk ? `${currentChunk} ${trimmed}` : trimmed;
    }
  }
  if (currentChunk) {
    chunks.push(currentChunk);
  }
  
  const finalChunks: string[] = [];
  for (const chunk of chunks) {
    if (chunk.length <= maxLen) {
      finalChunks.push(chunk);
    } else {
      const words = chunk.split(/\s+/);
      let subChunk = "";
      for (const word of words) {
        if (subChunk && (subChunk.length + word.length + 1 > maxLen)) {
          finalChunks.push(subChunk);
          subChunk = word;
        } else {
          subChunk = subChunk ? `${subChunk} ${word}` : word;
        }
      }
      if (subChunk) {
        finalChunks.push(subChunk);
      }
    }
  }
  
  return finalChunks;
};

export default function StoriesScreen() {
  const { setScreen, settings, setSettingsOpen, t } = useGameStore();
  const [selectedStoryId, setSelectedStoryId] = useState<string>(stories[0].id);
  const [showTranslation, setShowTranslation] = useState<boolean>(true);
  const [showTransliteration, setShowTransliteration] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>('');
  const [customTransliterated, setCustomTransliterated] = useState<string>('');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playQueueRef = useRef<string[]>([]);
  const currentQueueIndexRef = useRef<number>(0);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const activeStory = stories.find((s) => s.id === selectedStoryId) || stories[0];

  const playAudio = (text: string) => {
    // Cancel any active SpeechSynthesis
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    // Stop and clear any active Audio elements
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current = null;
    }

    const cleanText = text.trim();
    if (!cleanText) return;

    // Split text into chunks safe for Google TTS (max 150 characters)
    const chunks = splitIntoChunks(cleanText, 150);
    if (chunks.length === 0) return;

    playQueueRef.current = chunks;
    currentQueueIndexRef.current = 0;

    const playNext = () => {
      const index = currentQueueIndexRef.current;
      if (index >= playQueueRef.current.length) {
        // Queue finished
        return;
      }

      const chunk = playQueueRef.current[index];
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ru&client=tw-ob&q=${encodeURIComponent(chunk)}`;
      
      const audio = new Audio();
      (audio as any).referrerPolicy = "no-referrer";
      audio.src = ttsUrl;
      audio.volume = settings.voiceVolume / 100;
      audioRef.current = audio;

      audio.onended = () => {
        currentQueueIndexRef.current += 1;
        playNext();
      };

      audio.play().catch((err) => {
        console.warn('Google TTS chunk failed, using Web Speech Synthesis fallback', err);
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(chunk);
          utterance.lang = 'ru-RU';
          utterance.rate = 0.8;
          utterance.onend = () => {
            currentQueueIndexRef.current += 1;
            playNext();
          };
          utterance.onerror = () => {
            currentQueueIndexRef.current += 1;
            playNext();
          };
          window.speechSynthesis.speak(utterance);
        } else {
          // If no speechSynthesis, just move to next
          currentQueueIndexRef.current += 1;
          playNext();
        }
      });
    };

    playNext();
  };

  const handleCustomTextChange = (text: string) => {
    setCustomText(text);
    setCustomTransliterated(transliterate(text));
  };

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setScreen('selection')}
            variant="outline"
            size="icon"
            className="h-10 w-10 border-border text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
              <BookOpen className="w-7 h-7" />
              {t('stories.title')}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {t('stories.subtitle')}
            </p>
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

        {/* Stories Tabs & Controls */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-wrap gap-2 border-b border-border pb-4">
            {stories.map((story) => (
              <button
                key={story.id}
                onClick={() => {
                  setSelectedStoryId(story.id);
                  if (audioRef.current) audioRef.current.pause();
                }}
                className={`
                  px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200
                  ${
                    selectedStoryId === story.id
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                      : 'bg-background hover:bg-muted text-muted-foreground border border-border/40'
                  }
                `}
              >
                {story.titleRu} ({story.titleEs})
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center flex-wrap gap-3">
            <div className="flex gap-2">
              <Button
                variant={showTransliteration ? 'default' : 'outline'}
                onClick={() => setShowTransliteration(!showTransliteration)}
                className={`h-10 rounded-xl ${showTransliteration ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90' : 'border-border'}`}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {t('stories.transliterate')}
              </Button>
              <Button
                variant={showTranslation ? 'default' : 'outline'}
                onClick={() => setShowTranslation(!showTranslation)}
                className={`h-10 rounded-xl ${showTranslation ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border-border'}`}
              >
                <Languages className="w-4 h-4 mr-2" />
                {t('stories.translation')}
              </Button>
            </div>

            <button
              onClick={() => playAudio(activeStory.fragments.map(f => f.ru).join(' '))}
              className="h-10 px-4 flex items-center justify-center gap-2 border border-border hover:bg-muted text-foreground text-sm font-semibold rounded-xl transition-colors"
            >
              <Volume2 className="w-4 h-4 text-primary" />
              Escuchar cuento entero
            </button>
          </div>

          {/* Story Content View */}
          <div className="space-y-6 bg-background/50 rounded-xl p-5 border border-border/40 max-h-[450px] overflow-y-auto">
            {activeStory.fragments.map((frag, idx) => (
              <div 
                key={idx} 
                className="group border-b border-border/30 last:border-b-0 pb-4 last:pb-0 flex items-start gap-4 hover:bg-muted/10 p-2 rounded-lg transition-colors"
              >
                <button
                  onClick={() => playAudio(frag.ru)}
                  className="mt-1 p-2 rounded-lg bg-background hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all shadow-xs border border-border/40"
                  title="Escuchar párrafo"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                
                <div className="flex-1 space-y-1">
                  {/* Cyrillic Original */}
                  <p className="text-lg font-medium text-foreground leading-relaxed">
                    {frag.ru}
                  </p>
                  
                  {/* Latin Transliteration */}
                  {showTransliteration && (
                    <p className="text-sm font-medium text-secondary/90 italic tracking-wide">
                      {transliterate(frag.ru)}
                    </p>
                  )}

                  {/* Spanish Translation */}
                  {showTranslation && (
                    <p className="text-sm text-muted-foreground leading-relaxed pt-0.5">
                      {frag.es}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Transliterator & External Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Custom Transliterator Box (Takes 2 cols) */}
          <div className="md:col-span-2 bg-card border border-border/85 rounded-2xl p-6 shadow-lg space-y-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-secondary" />
              {t('stories.custom')}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t('stories.customDesc')}
            </p>

            <div className="space-y-3">
              <textarea
                value={customText}
                onChange={(e) => handleCustomTextChange(e.target.value)}
                placeholder={t('stories.customPlaceholder')}
                className="w-full h-24 p-3 bg-background border border-border rounded-xl placeholder:text-muted-foreground focus:border-secondary focus:ring-0 focus:outline-hidden text-sm resize-none"
              />
              
              {customTransliterated && (
                <div className="p-3 bg-muted/40 border border-border/60 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-secondary uppercase tracking-wide">
                      {t('stories.transliterate')}
                    </span>
                    <button
                      onClick={() => playAudio(customText)}
                      className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-sm text-foreground italic whitespace-pre-wrap break-words leading-relaxed">
                    {customTransliterated}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Recommended Links (Takes 1 col) */}
          <div className="bg-card border border-border/85 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Link className="w-5 h-5 text-primary" />
                {t('stories.externalLinks')}
              </h3>
              <div className="space-y-2 pt-2">
                <a
                  href="https://russiancrafts.com/russian-folk-tales"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg bg-background hover:bg-muted border border-border/50 text-xs font-medium text-foreground hover:text-primary transition-all group"
                >
                  <span className="truncate pr-2">{t('stories.extLink1')}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-1 text-primary" />
                </a>
                <a
                  href="https://www.loyalbooks.com/language/Russian"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg bg-background hover:bg-muted border border-border/50 text-xs font-medium text-foreground hover:text-primary transition-all group"
                >
                  <span className="truncate pr-2">Audiobooks infantiles en ruso</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-1 text-primary" />
                </a>
              </div>
            </div>
            
            <p className="text-[10px] text-muted-foreground/80 mt-4 leading-relaxed bg-muted/20 p-2 rounded-lg border border-border/30">
              Copia textos rusos de estos sitios y pégalos en el trasliterador para poder leerlos fácilmente con letras latinas.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
