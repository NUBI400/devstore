"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleRegister = async () => {
    try {
      setIsLoading(true);
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      toast.error("Ocorreu um erro ao fazer o cadastro.");
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
          <h1 className="text-2xl font-bold">Criar nova conta</h1>
          <p className="text-muted-foreground">
            Registre-se para acessar todos os cursos
          </p>
        </div>
        
        <RegisterForm />
        
        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Já tem uma conta?{" "}
            <Link href="/login" className="font-medium underline underline-offset-4">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 