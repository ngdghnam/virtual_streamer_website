"use client";
import { createContext, useState, useContext, ReactNode } from "react";

interface SurveyContextType {
  isSurveyCompleted: boolean;
  setIsSurveyCompleted: (completed: boolean) => void;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

interface SurveyProviderProps {
  children: ReactNode;
}

export function SurveyProvider({ children }: SurveyProviderProps) {
  const [isSurveyCompleted, setIsSurveyCompleted] = useState<boolean>(false);

  return (
    <SurveyContext.Provider value={{ isSurveyCompleted, setIsSurveyCompleted }}>
      {children}
    </SurveyContext.Provider>
  );
}

export function useSurveyContext(): SurveyContextType {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error("useSurveyContext must be used within a SurveyProvider");
  }
  return context;
}
