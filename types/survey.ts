// types/survey.ts
export type SurveyQuestion = {
  row_number: number;
  question_id: string;
  group: string;
  branch: string;
  type: string;
  question_text: string;
  options: string[];
};

export type SurveyData = {
  data: SurveyQuestion[];
};

export interface SurveySession {
  sessionId: string;
  currentStep: string;
  responses: Record<string, string>;
  score?: number;
  branch?: string
}
