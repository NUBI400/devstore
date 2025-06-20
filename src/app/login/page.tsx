"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      toast.error("Ocorreu um erro ao fazer login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            <Image 
              src="/logo.png" 
              alt="Curso App" 
              width={80} 
              height={80} 
            />
          </div>
          <h1 className="text-2xl font-bold">Entrar na sua conta</h1>
          <p className="text-muted-foreground">
            Entre com sua conta para acessar os cursos
          </p>
        </div>
        
        <LoginForm />
        
        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Não tem uma conta?{" "}
            <Link href="/register" className="font-medium underline underline-offset-4">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 