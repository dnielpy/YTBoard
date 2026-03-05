"use client";

import { LogIn, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const UserAuthBadge = () => {
  // const { data: session, status } = useSession();      //Cgange this when Next-Auth is enabled
  const session = {
    user: {
      name: "Daniel Quesada",
      image: "/test",
    },
  };
  const loading = false;
  const userName = session?.user?.name ?? "No autenticado";
  const firstLetter = userName?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <div className="flex items-center justify-between rounded-lg border px-4 py-3 text-xs">
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9 border ">
          <AvatarImage src={session?.user?.image ?? undefined} alt={userName} />
          <AvatarFallback>
            {loading ? <User className="h-4 w-4" /> : firstLetter}
          </AvatarFallback>
        </Avatar>
        <div className="leading-tight">
          <p className="font-semibold text-sm">
            {loading ? "Cargando..." : userName}
          </p>
        </div>
      </div>

      {session ? (
        <button
          // onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="inline-flex items-center gap-1.5 border rounded-md px-3 py-2 text-xs font-medium  transition hover:bg-primary hover:text-white"
        >
          <LogOut className="h-3.5 w-3.5" />
          Salir
        </button>
      ) : (
        <button
          // disabled={loading}
          // onClick={() => signIn("google")}
          className="inline-flex items-center gap-1.5 rounded-md bg-red-500 px-3 py-2 text-xs font-semibold  transition hover:bg-red-600 disabled:opacity-60"
        >
          <LogIn className="h-3.5 w-3.5" />
          Iniciar con YouTube
        </button>
      )}
    </div>
  );
};
