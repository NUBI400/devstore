"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/providers/trpc-provider";
import { useState } from "react";
import { toast } from "sonner";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const subscriptionMutation = api.stripe.createCheckoutSession.useMutation({
    onSuccess: ({ url }: { url: string }) => {
      window.location.href = url;
    },
    onError: () => {
      toast.error("Ocorreu um erro ao processar sua solicitação.");
      setIsLoading(false);
    },
  });

  const handleSubscribe = async () => {
    setIsLoading(true);
    subscriptionMutation.mutate();
  };

  if (status === "loading") {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Image 
          src="/logo.png" 
          alt="Curso App" 
          width={80} 
          height={80}
          className="mb-4"
        />
        <p>Carregando...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    redirect("/login");
  }

  return (
    <main className="container mx-auto p-4 max-w-6xl">
      <div className="flex items-center mb-6">
        <Image 
          src="/logo.png" 
          alt="Curso App" 
          width={40} 
          height={40}
          className="mr-3"
        />
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo, {session?.user.name}</CardTitle>
            <CardDescription>Gerencie sua conta e assinatura</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Status da assinatura:</p>
                <p className="text-muted-foreground">Gratuito</p>
              </div>
              <Button
                onClick={handleSubscribe}
                disabled={isLoading}
              >
                {isLoading ? "Processando..." : "Assinar Premium"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progresso</CardTitle>
            <CardDescription>Seu progresso nos cursos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Você ainda não começou nenhum curso.
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/courses">Explorar cursos</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-4">Cursos Recomendados</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>Curso exemplo {i}</CardTitle>
              <CardDescription>
                Descrição do curso exemplo {i}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Este é um exemplo de curso que estará disponível após a assinatura.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
} 