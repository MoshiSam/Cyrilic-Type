import { useGameStore } from '@/hooks/useGameStore';
import { Button } from '@/components/ui/button';
import { Play, Settings } from 'lucide-react';

export default function MenuScreen() {
  const { setScreen, setSettingsOpen, t } = useGameStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 relative">
      {/* Settings gear on the top right */}
      <div className="absolute top-6 right-6">
        <Button
          onClick={() => setSettingsOpen(true)}
          variant="outline"
          size="icon"
          className="h-10 w-10 border-border hover:bg-muted text-muted-foreground hover:text-foreground rounded-xl transition-all"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      <div className="text-center mb-10 max-w-sm">
        <h1 className="text-5xl font-extrabold mb-3 text-primary tracking-tight font-cyrillic">
          {t('menu.title')}
        </h1>
        <p className="text-secondary text-base font-semibold">
          {t('menu.subtitle')}
        </p>
      </div>

      <div className="flex flex-col gap-3.5 w-full max-w-xs">
        {/* Play / Practice */}
        <Button
          onClick={() => setScreen('selection')}
          className="w-full h-14 text-base font-bold bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl transition-all duration-200 shadow-md shadow-primary/20"
        >
          <Play className="w-5 h-5 mr-2.5 fill-current" />
          {t('menu.start')}
        </Button>
      </div>

      <div className="mt-12 text-center max-w-xs">
        <p className="text-xs text-muted-foreground/80 leading-relaxed">
          {t('menu.footer')}
        </p>
      </div>
    </div>
  );
}

