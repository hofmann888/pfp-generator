import CharacterGenerator from '@/components/CharacterGenerator';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-500 p-4">
      <div className="max-w-6xl mx-auto">
        <CharacterGenerator />
      </div>
    </main>
  );
} 