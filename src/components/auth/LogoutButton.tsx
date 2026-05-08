"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      // Encerra a sessão e recarrega a Home
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Sair
    </Button>
  );
}