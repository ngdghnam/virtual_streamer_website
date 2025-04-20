import { SurveyQuestion } from "@/types/survey";

export interface ExtraPreliminaryStepProps {
  questionsByType: Record<string, SurveyQuestion[]>;
  responses: Record<string, string>;
  handleResponseChange: (questionId: string, value: string) => void;
  onNextStep?: () => void;
}
