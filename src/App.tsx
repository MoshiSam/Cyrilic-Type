import { GameProvider, useGameStore } from '@/hooks/useGameStore';
import MenuScreen from '@/sections/MenuScreen';
import SelectionScreen from '@/sections/SelectionScreen';
import QuizScreen from '@/sections/QuizScreen';
import ReferenceScreen from '@/sections/ReferenceScreen';
import StoriesScreen from '@/sections/StoriesScreen';
import DictionaryScreen from '@/sections/DictionaryScreen';
import SettingsPanel from '@/components/SettingsPanel';

function AppContent() {
  const { screen } = useGameStore();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
      {screen === 'menu' && <MenuScreen />}
      {screen === 'selection' && <SelectionScreen />}
      {screen === 'quiz' && <QuizScreen />}
      {screen === 'reference' && <ReferenceScreen />}
      {screen === 'stories' && <StoriesScreen />}
      {screen === 'dictionary' && <DictionaryScreen />}
      
      {/* Global Settings Panel */}
      <SettingsPanel />
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;

