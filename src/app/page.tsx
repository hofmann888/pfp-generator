import CharacterGenerator from '@/components/CharacterGenerator';

export default function Home() {
  return (
    <main className="min-h-screen py-16 max-md:py-6 bg-[url(/img/bg.png)] bg-cover bg-top">
      <div className="w-[76%] max-md:w-[92%] mx-auto min-h-[inherit]">
        <CharacterGenerator />
      </div>
    </main>
  );
} 