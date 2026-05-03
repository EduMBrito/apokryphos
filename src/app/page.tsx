export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="font-serif text-5xl md:text-7xl font-semibold mb-6">
        Apokryphos
      </h1>
      
      <p className="font-sans text-lg md:text-xl text-slate-300 max-w-2xl text-center mb-12">
        O que está oculto, reservado para si. Uma camada de sedimento dos seus pensamentos.
      </p>

      <div className="bg-slate-800 px-6 py-3 rounded-lg border border-slate-700">
        <span className="font-script text-3xl text-indigo-400">
          Estado emocional: Focado
        </span>
      </div>
    </main>
  );
}