"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useCourseStore } from "@/store/use-course-store";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { api } from "@/providers/trpc-provider";

// Dados simulados de cursos
const MOCK_COURSES = [
  {
    id: "course-1",
    title: "Introdução ao Next.js",
    description: "Aprenda os fundamentos do Next.js e React",
    imageUrl: "https://placehold.co/600x400/1f2937/ffffff?text=Next.js",
    lessons: 12,
    premium: false,
  },
  {
    id: "course-2",
    title: "Autenticação com NextAuth",
    description: "Implementação completa de autenticação em aplicações Next.js",
    imageUrl: "https://placehold.co/600x400/1f2937/ffffff?text=NextAuth",
    lessons: 8,
    premium: true,
  },
  {
    id: "course-3",
    title: "Banco de Dados com Prisma",
    description: "Modelagem de dados e querys com Prisma ORM",
    imageUrl: "https://placehold.co/600x400/1f2937/ffffff?text=Prisma",
    lessons: 10,
    premium: true,
  },
  {
    id: "course-4",
    title: "Estilização com TailwindCSS",
    description: "Construindo interfaces modernas com TailwindCSS",
    imageUrl: "https://placehold.co/600x400/1f2937/ffffff?text=TailwindCSS",
    lessons: 6,
    premium: false,
  },
  {
    id: "course-5",
    title: "APIs com tRPC",
    description: "Comunicação tipada entre frontend e backend com tRPC",
    imageUrl: "https://placehold.co/600x400/1f2937/ffffff?text=tRPC",
    lessons: 9,
    premium: true,
  },
  {
    id: "course-6",
    title: "Gerenciamento de Estado com Zustand",
    description: "Aprenda a gerenciar estados globais com Zustand",
    imageUrl: "https://placehold.co/600x400/1f2937/ffffff?text=Zustand",
    lessons: 7,
    premium: true,
  },
];

export default function CoursesPage() {
  const { data: session, status } = useSession();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { viewedCourses, viewCourse } = useCourseStore();

  // Consulta status da assinatura
  const subscriptionQuery = api.user.getSubscriptionStatus.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  // Efeito para atualizar o status da assinatura quando os dados mudarem
  useEffect(() => {
    if (subscriptionQuery.data) {
      setIsSubscribed(
        subscriptionQuery.data === "ACTIVE" || 
        subscriptionQuery.data === "TRIALING"
      );
    }
  }, [subscriptionQuery.data]);

  const handleCourseClick = (courseId: string) => {
    viewCourse(courseId);
    toast.success("Curso adicionado aos recentes");
  };

  return (
    <main className="container mx-auto p-4 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center">
          <Image 
            src="/logo.png" 
            alt="Curso App" 
            width={40} 
            height={40}
            className="mr-3"
          />
          <div>
            <h1 className="text-3xl font-bold mb-2">Cursos</h1>
            <p className="text-muted-foreground">
              Explore nossos cursos e aprenda no seu próprio ritmo
            </p>
          </div>
        </div>
        
        {!isSubscribed && (
          <Button asChild size="sm" className="mt-4 md:mt-0">
            <Link href="/pricing">Assinar Premium</Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_COURSES.map((course) => (
          <Card key={course.id} className={`overflow-hidden ${course.premium && !isSubscribed ? 'opacity-70' : ''}`}>
            <div className="aspect-video bg-muted">
              <img 
                src={course.imageUrl} 
                alt={course.title}
                className="w-full h-full object-cover" 
              />
            </div>
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm">{course.lessons} aulas</span>
                {course.premium && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Premium
                  </span>
                )}
              </div>
            </CardContent>
            <CardFooter>
              {course.premium && !isSubscribed ? (
                <Button asChild variant="outline" className="w-full">
                  <Link href="/pricing">Desbloqueie com Premium</Link>
                </Button>
              ) : (
                <Button 
                  onClick={() => handleCourseClick(course.id)} 
                  variant="default" 
                  className="w-full"
                  asChild
                >
                  <Link href={`/courses/${course.id}`}>
                    {viewedCourses.includes(course.id) ? "Continuar" : "Começar"}
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
} 