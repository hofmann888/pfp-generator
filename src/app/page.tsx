import CharacterGenerator from '@/components/CharacterGenerator';

export default function Home() {
  return (
    <main className="min-h-screen py-16 max-md:py-6 bg-[url(/img/bg.png)] bg-cover bg-top">
      <div className="w-[76%] max-xl:w-[92%] max-md:max-w-[418px] mx-auto min-h-[inherit] max-lg:min-h-[450px] max-[900px]:min-h-[300px!important]">
        <CharacterGenerator />
      </div>
    </main>
  );
} 