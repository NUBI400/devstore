import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CourseProgress = {
  id: string;
  courseId: string;
  progress: number;
  completedLessons: string[];
  lastViewedAt: Date;
};

type CourseStore = {
  viewedCourses: string[];
  progress: CourseProgress[];
  viewCourse: (courseId: string) => void;
  updateProgress: (progress: CourseProgress) => void;
  markLessonCompleted: (courseId: string, lessonId: string) => void;
  resetProgress: (courseId: string) => void;
};

export const useCourseStore = create<CourseStore>()(
  persist(
    (set) => ({
      viewedCourses: [],
      progress: [],
      
      viewCourse: (courseId) => 
        set((state) => ({
          viewedCourses: state.viewedCourses.includes(courseId)
            ? state.viewedCourses
            : [...state.viewedCourses, courseId],
        })),
      
      updateProgress: (progressData) => 
        set((state) => {
          const existingProgressIndex = state.progress.findIndex(
            (p) => p.courseId === progressData.courseId
          );
          
          if (existingProgressIndex >= 0) {
            const updatedProgress = [...state.progress];
            updatedProgress[existingProgressIndex] = {
              ...progressData,
              lastViewedAt: new Date(),
            };
            return { progress: updatedProgress };
          }
          
          return { 
            progress: [...state.progress, {
              ...progressData,
              lastViewedAt: new Date(),
            }]
          };
        }),
      
      markLessonCompleted: (courseId, lessonId) => 
        set((state) => {
          const existingProgressIndex = state.progress.findIndex(
            (p) => p.courseId === courseId
          );
          
          if (existingProgressIndex >= 0) {
            const progress = state.progress[existingProgressIndex];
            
            if (!progress.completedLessons.includes(lessonId)) {
              const updatedProgress = [...state.progress];
              updatedProgress[existingProgressIndex] = {
                ...progress,
                completedLessons: [...progress.completedLessons, lessonId],
                progress: Math.min(100, progress.progress + 10),
                lastViewedAt: new Date(),
              };
              return { progress: updatedProgress };
            }
            return state;
          }
          
          return { 
            progress: [...state.progress, {
              id: crypto.randomUUID(),
              courseId,
              progress: 10,
              completedLessons: [lessonId],
              lastViewedAt: new Date(),
            }]
          };
        }),
      
      resetProgress: (courseId) => 
        set((state) => ({
          progress: state.progress.filter((p) => p.courseId !== courseId)
        })),
    }),
    {
      name: 'course-storage',
    }
  )
); 