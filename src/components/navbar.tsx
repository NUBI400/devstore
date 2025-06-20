"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="border-b border-border">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center mr-6">
            <Image 
              src="/logo.png" 
              alt="Curso App" 
              width={40} 
              height={40}
              className="mr-2" 
            />
            <span className="text-2xl font-bold">Curso App</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-4">
            <Link 
              href="/" 
              className={`text-sm font-medium transition-colors ${
                isActive("/") ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Início
            </Link>
            <Link 
              href="/courses" 
              className={`text-sm font-medium transition-colors ${
                isActive("/courses") ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Cursos
            </Link>
            <Link 
              href="/pricing" 
              className={`text-sm font-medium transition-colors ${
                isActive("/pricing") ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Preços
            </Link>
            {session?.user && (
              <Link 
                href="/dashboard" 
                className={`text-sm font-medium transition-colors ${
                  isActive("/dashboard") ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {status === "authenticated" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                    <AvatarFallback>
                      {session?.user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">Perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="cursor-pointer"
                >
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden md:flex">
                <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Cadastrar</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
} 