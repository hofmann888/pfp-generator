import CharacterGenerator from '@/components/CharacterGenerator';

export default function Home() {
  return (
    <main className="min-h-screen px-4 py-6 bg-[url(/img/bg.png)] bg-cover bg-top">
      <div className="max-w-6xl mx-auto min-h-[inherit]">
        <CharacterGenerator />
      </div>
    </main>
  );
} 