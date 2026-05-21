import { useCallback, useRef, useEffect } from 'react';
import { cyrillicGroups } from '@/data/cyrillicData';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Volume2, BookOpen } from 'lucide-react';
import { useGameStore } from '@/hooks/useGameStore';
import type { CyrillicLetter } from '@/types/cyrillic';

export default function ReferenceScreen() {
  const { setScreen, settings, t } = useGameStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

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

    const audio = new Audio(url);
    audio.volume = settings.voiceVolume / 100;
    audioRef.current = audio;

    audio.play().catch((err) => {
      console.warn('First audio attempt failed:', err);
      // Fallback: If wikimedia .ogg failed, try Google TTS
      if (typeof target === 'object' && target.audioUrl && url === target.audioUrl) {
        console.log('Falling back to Google TTS for letter pronunciation');
        const fallbackUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ru&client=tw-ob&q=${encodeURIComponent(cleanText)}`;
        const fallbackAudio = new Audio(fallbackUrl);
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

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setScreen('selection')}
            variant="outline"
            size="icon"
            className="h-10 w-10 border-border text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div className="text-center flex-1">
            <h2 className="text-3xl font-bold text-primary flex items-center justify-center gap-2 font-cyrillic">
              <BookOpen className="w-7 h-7" />
              {t('reference.title')}
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl mx-auto">
              {t('reference.subtitle')}
            </p>
          </div>
          
          <div className="w-10" />
        </div>

        {/* Alphabet grid */}
        <div className="space-y-8 font-sans">
          {cyrillicGroups.map((group) => (
            <div key={group.id} className="bg-card border border-border/80 rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-3 mb-6 pb-2 border-b border-border/40">
                <h3 className="text-lg font-bold text-primary">
                  {group.id === 'vowels' 
                    ? 'Vocales (Vowels)' 
                    : group.id === 'basic-consonants' 
                    ? 'Consonantes (Consonants)' 
                    : 'Signos (Signs)'}
                </h3>
                <span className="text-sm font-semibold text-muted-foreground/80 font-cyrillic">{group.titleRu}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {group.letters.map((letter) => (
                  <button
                    key={letter.char}
                    onClick={() => speakLetter(letter)}
                    className="
                      group relative bg-background border border-border/60 hover:border-primary/60 rounded-xl p-5
                      hover:bg-muted/30 transition-all duration-200 cursor-pointer
                      flex flex-col items-center gap-2 select-none shadow-xs
                    "
                  >
                    <div className="absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Volume2 className="w-4 h-4 text-primary" />
                    </div>

                    <div className="text-5xl font-black text-foreground group-hover:text-primary transition-colors font-cyrillic">
                      {letter.char.toLowerCase()}
                    </div>

                    <div className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">
                      {letter.char} = {letter.latin}
                    </div>

                    <div className="text-xs font-semibold text-secondary">
                      {letter.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quick table */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-primary mb-4">
            {t('reference.quickTable')}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3 px-4">{t('reference.cyrillic')}</th>
                  <th className="py-3 px-4">{t('reference.lower')}</th>
                  <th className="py-3 px-4">{t('reference.latin')}</th>
                  <th className="py-3 px-4">{t('reference.name')}</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {cyrillicGroups.flatMap((g) => g.letters).map((letter) => (
                  <tr
                    key={letter.char}
                    className="border-b border-border/40 hover:bg-muted/15 transition-colors"
                  >
                    <td className="py-3 px-4 text-2xl font-black text-foreground font-cyrillic">{letter.char}</td>
                    <td className="py-3 px-4 text-xl font-bold text-muted-foreground font-cyrillic">{letter.char.toLowerCase()}</td>
                    <td className="py-3 px-4 text-secondary font-bold font-mono">[{letter.latin}]</td>
                    <td className="py-3 px-4 text-foreground/80 text-sm font-semibold capitalize font-mono">{letter.name} ({letter.nameRu})</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => speakLetter(letter)}
                        className="p-2 rounded-xl bg-background hover:bg-primary/10 border border-border/50 text-muted-foreground hover:text-primary transition-colors shadow-xs"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
