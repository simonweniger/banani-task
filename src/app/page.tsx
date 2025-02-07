import DesignCanvas from "@/components/DesignCanvas";

export default function Home() {
  return (
    <div className="bg-background min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col items-start">
        <DesignCanvas />
      </main>
    </div>
  );
}
