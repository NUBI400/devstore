import { create } from 'zustand';

// Define o tipo de status de assinatura baseado no enum do Prisma
export type SubscriptionStatus = 
  | "ACTIVE" 
  | "CANCELED" 
  | "INCOMPLETE" 
  | "INCOMPLETE_EXPIRED" 
  | "PAST_DUE" 
  | "TRIALING" 
  | "UNPAID";

type SubscriptionStore = {
  status: SubscriptionStatus | null;
  isLoading: boolean;
  hasCheckedStatus: boolean;
  setStatus: (status: SubscriptionStatus | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setHasCheckedStatus: (hasChecked: boolean) => void;
  resetStore: () => void;
};

const initialState = {
  status: null,
  isLoading: false,
  hasCheckedStatus: false,
};

export const useSubscriptionStore = create<SubscriptionStore>()((set) => ({
  ...initialState,

  setStatus: (status) => set({ status }),
  
  setIsLoading: (isLoading) => set({ isLoading }),
  
  setHasCheckedStatus: (hasCheckedStatus) => set({ hasCheckedStatus }),
  
  resetStore: () => set(initialState),
})); 