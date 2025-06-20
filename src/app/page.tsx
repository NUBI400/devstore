import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-6xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <Image 
              src="/logo.png" 
              alt="Curso App" 
              width={120} 
              height={120} 
              className="mx-auto" 
            />
          </div>
          <h1 className="text-4xl font-bold">Bem-vindo ao Curso App</h1>
          <p className="text-xl text-muted-foreground">
            Uma plataforma moderna para aprendizado online
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Cursos Premium</CardTitle>
              <CardDescription>
                Acesse nossos cursos exclusivos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Conteúdo exclusivo criado por especialistas da indústria.</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/courses">Ver cursos</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comunidade</CardTitle>
              <CardDescription>
                Conecte-se com outros estudantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Interaja com outros estudantes e especialistas da área.</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/community">Explorar comunidade</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dashboard</CardTitle>
              <CardDescription>
                Gerencie seu progresso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Acompanhe seu progresso e gerencie sua assinatura.</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="secondary" className="w-full">
                <Link href="/dashboard">Acessar dashboard</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <Button asChild size="lg" className="mr-4">
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/register">Criar conta</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
