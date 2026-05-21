import { useState } from 'react';
import { useGameStore } from '@/hooks/useGameStore';
import { Button } from '@/components/ui/button';
import { Play, Settings, Heart, Copy, Check, X } from 'lucide-react';
import binanceQr from '../../binance_qr.png';

export default function MenuScreen() {
  const { setScreen, setSettingsOpen, t } = useGameStore();
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('241481784');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

      <div className="text-center mb-10 max-w-sm animate-fade-in">
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

        {/* Support / Donate */}
        <Button
          onClick={() => setIsDonateOpen(true)}
          variant="outline"
          className="w-full h-14 text-base font-bold border-border text-foreground hover:bg-muted hover:text-foreground rounded-xl transition-all duration-200"
        >
          <Heart className="w-5 h-5 mr-2.5 text-rose-500 fill-rose-500 animate-pulse" />
          {t('menu.donate')}
        </Button>
      </div>

      <div className="mt-12 text-center max-w-xs">
        <p className="text-xs text-muted-foreground/80 leading-relaxed">
          {t('menu.footer')}
        </p>
      </div>

      {/* Binance Donation Modal */}
      {isDonateOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div 
            onClick={() => setIsDonateOpen(false)}
            className="absolute inset-0"
          />
          <div className="bg-card/95 border border-border/80 rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center text-center space-y-5 relative animate-in zoom-in-95 duration-200 backdrop-blur-md z-10">
            {/* Close Button */}
            <button
              onClick={() => setIsDonateOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Heart Icon Container */}
            <div className="p-3 rounded-full bg-rose-500/10 text-rose-500">
              <Heart className="w-8 h-8 fill-rose-500 text-rose-500 animate-pulse" />
            </div>

            {/* Title */}
            <div>
              <h3 className="text-xl font-bold text-foreground">
                {t('menu.donate')}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Binance Pay ID
              </p>
            </div>

            {/* QR Code Container */}
            <div className="p-3 bg-white rounded-2xl shadow-inner border border-border/20">
              <img src={binanceQr} alt="Binance Pay QR Code" className="w-44 h-44 object-contain select-none" />
            </div>

            {/* Pay ID Display */}
            <div className="w-full bg-muted/50 border border-border/40 rounded-xl p-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pay ID</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-bold text-foreground">241481784</span>
                <button 
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg bg-background hover:bg-muted text-muted-foreground hover:text-foreground border border-border/40 transition-all active:scale-95"
                  title="Copiar ID"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Multi-language appreciation messages */}
            <div className="space-y-2 pt-3 border-t border-border/40 w-full text-center">
              <p className="text-sm font-medium text-foreground">
                Cualquier detalle se agradece
              </p>
              <p className="text-xs text-muted-foreground italic">
                Any support is greatly appreciated
              </p>
              <p className="text-xs text-muted-foreground/80 italic font-cyrillic">
                Буду благодарен за любую поддержку
              </p>
            </div>

            {/* Close action */}
            <Button
              onClick={() => setIsDonateOpen(false)}
              className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl font-bold transition-all shadow-md"
            >
              {t('settings.done') || 'Listo'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
