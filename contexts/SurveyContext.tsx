"use client";
import { createContext, useState, useContext } from "react";
import { SurveyContextType } from "@/types/SurveyContextType";
import { SurveyProviderProps } from "@/interfaces/iSurveyProviderProps";

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

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
