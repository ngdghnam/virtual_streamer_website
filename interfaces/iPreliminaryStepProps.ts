import { SurveyQuestion } from "@/types/survey";

export interface PreliminaryStepProps {
  questionsByType: Record<string, SurveyQuestion[]>;
  responses: Record<string, string>;
  handleResponseChange: (questionId: string, value: string) => void;
}
