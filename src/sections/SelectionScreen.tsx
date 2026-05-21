import { useGameStore } from '@/hooks/useGameStore';
import { cyrillicGroups } from '@/data/cyrillicData';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, ArrowRight, Settings, BookOpen, Sparkles, Languages } from 'lucide-react';

export default function SelectionScreen() {
  const { setScreen, selectedGroups, toggleGroup, selectAllGroups, deselectAllGroups, startQuiz, setSettingsOpen, t } =
    useGameStore();

  const anySelected = selectedGroups.length > 0;

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <Button
            onClick={() => setScreen('menu')}
            variant="outline"
            size="icon"
            className="h-10 w-10 border-border text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <h2 className="text-2xl font-bold text-center text-primary font-cyrillic">
            {t('selection.title')}
          </h2>

          <Button
            onClick={() => setSettingsOpen(true)}
            variant="outline"
            size="icon"
            className="h-10 w-10 border-border text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Bulk Action Buttons */}
        <div className="flex justify-center gap-6 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={selectAllGroups}
            className="text-secondary hover:text-secondary/95 hover:bg-secondary/15 font-bold rounded-lg transition-colors"
          >
            {t('selection.selectAll')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={deselectAllGroups}
            className="text-secondary hover:text-secondary/95 hover:bg-secondary/15 font-bold rounded-lg transition-colors"
          >
            {t('selection.deselectAll')}
          </Button>
        </div>

        {/* Group Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cyrillicGroups.map((group) => {
            const isSelected = selectedGroups.includes(group.id);
            return (
              <div key={group.id} className="bg-card rounded-2xl p-5 border border-border/80 shadow-md flex flex-col justify-start transition-colors">
                <div className="flex items-center gap-3 mb-5 pb-3 border-b border-border/40">
                  <Checkbox
                    id={group.id}
                    checked={isSelected}
                    onCheckedChange={() => toggleGroup(group.id)}
                    className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground rounded-md"
                  />
                  <label
                    htmlFor={group.id}
                    className="text-sm font-bold text-foreground cursor-pointer select-none"
                  >
                    {group.id === 'vowels' 
                      ? 'Vocales (Vowels)' 
                      : group.id === 'basic-consonants' 
                      ? 'Consonantes (Consonants)' 
                      : 'Signos (Signs)'}
                  </label>
                  <span className="text-xs font-semibold text-muted-foreground/80 ml-auto font-cyrillic">{group.titleRu}</span>
                </div>

                <div className="grid grid-cols-5 gap-2.5">
                  {group.letters.map((letter) => (
                    <div
                      key={letter.char}
                      className={`
                        aspect-square flex items-center justify-center rounded-xl text-lg font-bold
                        transition-all duration-200 select-none border
                        ${
                          isSelected
                            ? 'bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/15'
                            : 'bg-background text-muted-foreground border-border/40'
                        }
                      `}
                    >
                      {letter.char.toLowerCase()}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Actions */}
        <div className="flex justify-center gap-4 mt-12">
          <Button
            onClick={() => setScreen('menu')}
            variant="outline"
            className="px-6 py-5 text-base border-border text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('selection.back')}
          </Button>
          <Button
            onClick={startQuiz}
            disabled={!anySelected}
            className={`
              px-8 py-5 text-base font-bold rounded-xl transition-all duration-200
              ${
                anySelected
                  ? 'bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/20'
                  : 'bg-muted text-muted-foreground cursor-not-allowed border border-border/40'
              }
            `}
          >
            {t('selection.start')}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Otros Apartados (Extra sections requested by the user) */}
        <div className="mt-16 border-t border-border/50 pt-10">
          <h3 className="text-center text-lg font-bold text-foreground mb-6 uppercase tracking-wider">
            {t('selection.extraSections') || 'Otros Apartados'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {/* Referencia del Alfabeto */}
            <button
              onClick={() => setScreen('reference')}
              className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-card hover:bg-muted text-left transition-all duration-200 shadow-sm group hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-foreground group-hover:text-primary transition-colors">
                  {t('menu.reference')}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t('reference.subtitle_short') || 'Consulta y escucha el abecedario ruso'}
                </p>
              </div>
            </button>

            {/* Cuentos Infantiles */}
            <button
              onClick={() => setScreen('stories')}
              className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-card hover:bg-muted text-left transition-all duration-200 shadow-sm group hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="p-3 rounded-xl bg-secondary/15 text-secondary group-hover:bg-secondary/25 transition-colors">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-foreground group-hover:text-secondary transition-colors">
                  {t('menu.stories')}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t('stories.subtitle_short') || 'Lectura de cuentos interactivos con audio'}
                </p>
              </div>
            </button>

            {/* Diccionario */}
            <button
              onClick={() => setScreen('dictionary')}
              className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-card hover:bg-muted text-left transition-all duration-200 shadow-sm group hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                <Languages className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-foreground group-hover:text-primary transition-colors">
                  {t('menu.dictionary')}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t('dictionary.subtitle_short') || 'Buscador de palabras y traducción online'}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
