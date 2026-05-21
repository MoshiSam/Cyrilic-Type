import { useGameStore } from '@/hooks/useGameStore';
import { ArrowLeft, Volume2, Globe } from 'lucide-react';
import type { GameTheme, FontStyle, AutoSubmitSetting } from '@/types/cyrillic';

export default function SettingsPanel() {
  const { isSettingsOpen, setSettingsOpen, settings, updateSettings, t } = useGameStore();

  if (!isSettingsOpen) return null;

  return (
    <>
      {/* Overlay backdrop */}
      <div 
        onClick={() => setSettingsOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity duration-300 animate-in fade-in"
      />

      {/* Settings Drawer Panel */}
      <div 
        className="fixed inset-y-0 right-0 w-full max-w-md bg-card border-l border-border shadow-2xl z-50 flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">
            {t('settings.title')}
          </h2>
          <button 
            onClick={() => setSettingsOpen(false)}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
          
          {/* Quiz Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
              {t('settings.quiz')}
            </h3>
            
            {/* Auto Submit */}
            <div className="bg-muted/40 rounded-xl p-4 border border-border/40 space-y-3">
              <label className="text-sm font-medium text-foreground block">
                {t('settings.autoSubmit')}
              </label>
              <div className="space-y-2">
                {(['never', 'correct', 'always'] as AutoSubmitSetting[]).map((val) => (
                  <label key={val} className="flex items-center gap-3 cursor-pointer group text-sm text-muted-foreground hover:text-foreground">
                    <input 
                      type="radio" 
                      name="autoSubmit" 
                      value={val}
                      checked={settings.autoSubmit === val}
                      onChange={() => updateSettings({ autoSubmit: val })}
                      className="w-4 h-4 text-primary bg-background border-border focus:ring-primary focus:ring-offset-0 focus:ring-1"
                    />
                    <span className={settings.autoSubmit === val ? 'text-foreground font-medium' : ''}>
                      {t(`settings.autoSubmit.${val}`)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Checkbox Options */}
            <div className="space-y-3">
              {/* Requeue Incorrect */}
              <label className="flex items-start gap-3 cursor-pointer group p-1">
                <input 
                  type="checkbox"
                  checked={settings.requeueIncorrect}
                  onChange={(e) => updateSettings({ requeueIncorrect: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded-sm text-primary bg-background border-border focus:ring-primary focus:ring-offset-0 focus:ring-1"
                />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {t('settings.requeue')}
                </span>
              </label>

              {/* Show X on mismatch */}
              <label className="flex items-start gap-3 cursor-pointer group p-1">
                <input 
                  type="checkbox"
                  checked={settings.showXOnMismatch}
                  onChange={(e) => updateSettings({ showXOnMismatch: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded-sm text-primary bg-background border-border focus:ring-primary focus:ring-offset-0 focus:ring-1"
                />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {t('settings.showX')}
                </span>
              </label>

              {/* Show progress bar */}
              <label className="flex items-start gap-3 cursor-pointer group p-1">
                <input 
                  type="checkbox"
                  checked={settings.showProgressBar}
                  onChange={(e) => updateSettings({ showProgressBar: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded-sm text-primary bg-background border-border focus:ring-primary focus:ring-offset-0 focus:ring-1"
                />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {t('settings.showProgress')}
                </span>
              </label>

              {/* Confetti on correct */}
              <label className="flex items-start gap-3 cursor-pointer group p-1">
                <input 
                  type="checkbox"
                  checked={settings.confettiOnCorrect}
                  onChange={(e) => updateSettings({ confettiOnCorrect: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded-sm text-primary bg-background border-border focus:ring-primary focus:ring-offset-0 focus:ring-1"
                />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {t('settings.confetti')}
                </span>
              </label>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
              {t('settings.appearance')}
            </h3>

            {/* Language */}
            <div className="bg-muted/40 rounded-xl p-4 border border-border/40 space-y-3">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Globe className="w-4 h-4 text-secondary" />
                {t('settings.language')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['es', 'en'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => updateSettings({ language: lang })}
                    className={`
                      py-2 px-4 text-sm font-medium rounded-lg border transition-all duration-200
                      ${
                        settings.language === lang
                          ? 'bg-secondary text-secondary-foreground border-secondary shadow-sm shadow-secondary/15'
                          : 'bg-background hover:bg-muted text-muted-foreground border-border/50'
                      }
                    `}
                  >
                    {lang === 'es' ? 'Español' : 'English'}
                  </button>
                ))}
              </div>
            </div>

            {/* Themes */}
            <div className="bg-muted/40 rounded-xl p-4 border border-border/40 space-y-3">
              <label className="text-sm font-medium text-foreground block">
                {t('settings.theme')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['dark', 'light', 'sakura', 'forest'] as GameTheme[]).map((thm) => (
                  <label 
                    key={thm} 
                    className={`
                      flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors text-sm
                      ${
                        settings.theme === thm 
                          ? 'bg-background text-foreground border-primary' 
                          : 'bg-background/40 hover:bg-muted text-muted-foreground border-border/50'
                      }
                    `}
                  >
                    <input 
                      type="radio" 
                      name="theme" 
                      value={thm}
                      checked={settings.theme === thm}
                      onChange={() => updateSettings({ theme: thm })}
                      className="w-3.5 h-3.5 text-primary bg-background border-border focus:ring-primary focus:ring-offset-0 focus:ring-1"
                    />
                    <span className="capitalize">{t(`settings.theme.${thm}`)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Fonts */}
            <div className="bg-muted/40 rounded-xl p-4 border border-border/40 space-y-3">
              <label className="text-sm font-medium text-foreground block">
                {t('settings.font')}
              </label>
              <div className="space-y-2">
                {(['noto-sans', 'hina-mincho', 'random'] as FontStyle[]).map((font) => (
                  <label key={font} className="flex items-center gap-3 cursor-pointer group text-sm text-muted-foreground hover:text-foreground">
                    <input 
                      type="radio" 
                      name="fontStyle" 
                      value={font}
                      checked={settings.fontStyle === font}
                      onChange={() => updateSettings({ fontStyle: font })}
                      className="w-4 h-4 text-primary bg-background border-border focus:ring-primary focus:ring-offset-0 focus:ring-1"
                    />
                    <span className={`${settings.fontStyle === font ? 'text-foreground font-medium' : ''} ${font === 'hina-mincho' ? 'font-serif' : 'font-sans'}`}>
                      {font === 'noto-sans' 
                        ? t('settings.font.noto') 
                        : font === 'hina-mincho' 
                        ? t('settings.font.hina') 
                        : t('settings.font.random')}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Audio Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
              {t('settings.audio')}
            </h3>

            {/* Interface Vol */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{t('settings.volInterface')}</span>
                <span>{settings.interfaceVolume}%</span>
              </div>
              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={settings.interfaceVolume}
                  onChange={(e) => updateSettings({ interfaceVolume: parseInt(e.target.value) })}
                  className="flex-1 h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>

            {/* Voice Vol */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{t('settings.volVoice')}</span>
                <span>{settings.voiceVolume}%</span>
              </div>
              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={settings.voiceVolume}
                  onChange={(e) => updateSettings({ voiceVolume: parseInt(e.target.value) })}
                  className="flex-1 h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Danger zone / Sticky Footer with Done button */}
        <div className="absolute bottom-0 inset-x-0 p-6 bg-card border-t border-border flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-rose-500/85 uppercase tracking-wider">
              {t('settings.danger')}
            </span>
            <div className="w-full h-px bg-border/50 mb-1" />
          </div>
          
          <button
            onClick={() => setSettingsOpen(false)}
            className="w-full h-12 bg-pink-600 hover:bg-pink-500 active:bg-pink-700 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-pink-600/20"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('settings.done')}
          </button>
        </div>

      </div>
    </>
  );
}
