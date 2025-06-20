"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/providers/trpc-provider";

export default function PricingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
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
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    setIsLoading(true);
    subscriptionMutation.mutate();
  };

  return (
    <main className="container mx-auto p-4 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <Image 
            src="/logo.png" 
            alt="Curso App" 
            width={80} 
            height={80}
          />
        </div>
        <h1 className="text-4xl font-bold mb-3">Planos e Preços</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Escolha o plano perfeito para suas necessidades de aprendizado
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Plano Gratuito</CardTitle>
            <CardDescription>Acesso a conteúdo básico</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">R$ 0</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
          </CardHeader>
          <CardContent className="border-t pt-4">
            <ul className="space-y-2">
              <li className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-primary"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>Acesso a cursos básicos</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-primary"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>Visualização limitada</span>
              </li>
              <li className="flex items-center text-muted-foreground">
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
                <span>Sem acesso a cursos premium</span>
              </li>
              <li className="flex items-center text-muted-foreground">
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
                <span>Sem certificados</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Plano Atual
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-primary shadow-md">
          <CardHeader>
            <div className="bg-primary text-primary-foreground text-xs rounded-full py-1 px-3 w-fit mb-2">
              Popular
            </div>
            <CardTitle>Plano Premium</CardTitle>
            <CardDescription>Acesso completo a todos os cursos</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">R$ 29,90</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
          </CardHeader>
          <CardContent className="border-t pt-4">
            <ul className="space-y-2">
              <li className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-primary"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>Acesso completo a todos os cursos</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-primary"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>Materiais exclusivos</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-primary"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>Certificados de conclusão</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-primary"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>Acesso a novos cursos</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={handleSubscribe}
              disabled={isLoading}
            >
              {isLoading ? "Processando..." : "Assinar agora"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plano Empresarial</CardTitle>
            <CardDescription>Para equipes e empresas</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">R$ 299,90</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
          </CardHeader>
          <CardContent className="border-t pt-4">
            <ul className="space-y-2">
              <li className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-primary"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>Tudo do plano Premium</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-primary"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>Acesso para até 10 usuários</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-primary"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>Relatórios de progresso</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-primary"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>Suporte dedicado</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Contate-nos
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
} 