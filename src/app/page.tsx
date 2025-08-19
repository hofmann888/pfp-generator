import CharacterGenerator from '@/components/CharacterGenerator';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎨 Генератор Персонажей
          </h1>
          <p className="text-gray-600 text-lg">
            Создайте уникального персонажа, выбирая разные части тела
          </p>
        </header>
        
        <CharacterGenerator />
      </div>
    </main>
  );
} 