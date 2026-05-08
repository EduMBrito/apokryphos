import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function Navbar() {
  // Busca a sessão do usuário diretamente no Servidor
  const session = await getServerSession(authOptions);

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl font-medium text-slate-100 hover:text-indigo-400 transition-colors">
          Apokryphos
        </Link>

        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {session.user?.image && (
                  <img
                    src={session.user.image}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full border border-slate-700"
                  />
                )}
                <span className="text-sm font-medium text-slate-300 hidden md:block">
                  {session.user?.name}
                </span>
              </div>
              <div className="w-px h-6 bg-slate-800 hidden md:block"></div>
              <LogoutButton />
            </div>
          ) : (
            <Link 
              href="/api/auth/signin" 
              className="text-sm text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Acessar o Abismo
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}