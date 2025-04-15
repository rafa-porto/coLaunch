"use client";

import { create } from "zustand";

interface FormStepState {
  currentStep: number;
  totalSteps: number;
  setCurrentStep: (step: number) => void;
  setTotalSteps: (total: number) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const useFormStep = create<FormStepState>((set) => ({
  currentStep: 1,
  totalSteps: 4,
  setCurrentStep: (step) => set({ currentStep: step }),
  setTotalSteps: (total) => set({ totalSteps: total }),
  nextStep: () => set((state) => ({ 
    currentStep: state.currentStep < state.totalSteps 
      ? state.currentStep + 1 
      : state.currentStep 
  })),
  prevStep: () => set((state) => ({ 
    currentStep: state.currentStep > 1 
      ? state.currentStep - 1 
      : state.currentStep 
  })),
}));
