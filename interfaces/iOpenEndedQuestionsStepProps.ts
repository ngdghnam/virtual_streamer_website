import { SurveyQuestion } from "@/types/survey";

export interface OpenEndedQuestionStepProps {
  questionsByType: Record<string, SurveyQuestion[]>;
  responses: Record<string, string>;
  handleResponseChange: (questionId: string, value: string) => void;
  currentOpenEndedIndex: number;
  setCurrentOpenEndedIndex: React.Dispatch<React.SetStateAction<number>>;
  handleNextOpenEndedQuestion: () => void;
  onSurveySubmit: () => void
}
