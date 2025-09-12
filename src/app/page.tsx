import CharacterGenerator from '@/components/CharacterGenerator';

export default function Home() {
  return (
    <main className="min-h-screen py-16 max-md:py-6 bg-[url(/img/bg.png)] bg-cover bg-top">
      <div className="w-[1355px] max-[1536px]:w-[1230px] max-[1330px]:w-[92%] max-[1280px]:w-[1020px] max-[1110px]:w-[92%] max-lg:w-[800px] max-[850px]:w-[92%!important] max-md:max-w-[418px] mx-auto min-h-[inherit] max-lg:min-h-[450px] max-[900px]:min-h-[300px!important]">
        <CharacterGenerator />
      </div>
    </main>
  );
} 