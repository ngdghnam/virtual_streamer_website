import { SurveyQuestion } from "@/types/survey";

export interface DemographicStepProps {
  questionsByType: Record<string, SurveyQuestion[]>;
  responses: Record<string, string>;
  handleResponseChange: (questionId: string, value: string) => void;
}
