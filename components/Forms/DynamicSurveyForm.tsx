"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { useSurveySession } from "@/hooks/useSurveySession";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useSurveyContext } from "@/contexts/SurveyContext";

import DemographicStep from "./Steps/DemographicStep";
import PreliminaryStep from "./Steps/PreliminaryStep";
import ExtraPreliminaryStep from "./Steps/ExtraPreliminaryStep";
import BranchDetailsStep from "./Steps/BranchDetailsStep";
import OpenEndedQuestionStep from "./Steps/OpenEndedQuestionStep";

import { SurveyQuestion, SurveySession } from "@/types/survey";

const DynamicSurveyForm: React.FC = () => {
  const { session, questions, updateSession, isLoading, error } =
    useSurveySession();
  const { setIsSurveyCompleted } = useSurveyContext();

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentOpenEndedIndex, setCurrentOpenEndedIndex] = useState<number>(0);
  const [localSession, setLocalSession] = useState<SurveySession | null>(null);

  useEffect(() => {
    if (session) setLocalSession(session);
  }, [session]);

  useEffect(() => {
    // Update the global survey completion status when the survey is submitted
    if (submitted) {
      setIsSurveyCompleted(true);
    }
  }, [submitted, setIsSurveyCompleted]);

  const handleResponseChange = (questionId: string, value: string) => {
    if (!localSession) return;

    const updatedSession = {
      ...localSession,
      responses: {
        ...(localSession.responses || {}),
        [questionId]: value,
      },
    };

    sessionStorage.setItem("surveySession", JSON.stringify(updatedSession));
    setLocalSession(updatedSession);
  };

  const handleNextStep = async () => {
    setSubmitError(null);

    try {
      const updated = await updateSession();
      setLocalSession(updated);
    } catch (err) {
      console.error("Failed to advance step:", err);
      setSubmitError("Failed to move to the next step. Try again.");
    }
  };

  const organizeQuestionsByType = (questions: SurveyQuestion[] | null) => {
    if (!questions) return {};
    return questions.reduce((acc, question) => {
      const type = question.type || "unclassified";
      acc[type] = acc[type] || [];
      acc[type].push(question);
      return acc;
    }, {} as Record<string, SurveyQuestion[]>);
  };

  const questionsByType = organizeQuestionsByType(questions);

  if (isLoading || !localSession)
    return <div className="text-center py-8">Loading survey...</div>;
  if (error)
    return (
      <div className="text-center py-8 text-red-500">
        Error initializing survey
      </div>
    );

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center">
        <Card className="shadow-sm bg-[#FAF8F8] p-8">
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
            <CardTitle className="text-2xl">Cảm ơn bạn!</CardTitle>
            <p className="text-gray-600">
              Câu trả lời của bạn đã được ghi nhận
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form className="space-y-8">
        <DemographicStep
          questionsByType={questionsByType}
          responses={localSession.responses || {}}
          handleResponseChange={handleResponseChange}
          onNextStep={handleNextStep}
        />

        <PreliminaryStep
          questionsByType={questionsByType}
          responses={localSession.responses || {}}
          handleResponseChange={handleResponseChange}
          onNextStep={handleNextStep}
        />

        <ExtraPreliminaryStep
          questionsByType={questionsByType}
          responses={localSession.responses || {}}
          handleResponseChange={handleResponseChange}
          onNextStep={handleNextStep}
        />

        <BranchDetailsStep
          questionsByType={questionsByType}
          responses={localSession.responses || {}}
          handleResponseChange={handleResponseChange}
          onNextStep={handleNextStep}
        />

        <OpenEndedQuestionStep
          questionsByType={questionsByType}
          responses={localSession.responses || {}}
          handleResponseChange={handleResponseChange}
          currentOpenEndedIndex={currentOpenEndedIndex}
          setCurrentOpenEndedIndex={setCurrentOpenEndedIndex}
          onSurveySubmit={() => setSubmitted(true)}
          handleNextOpenEndedQuestion={function (): void {
            throw new Error("Function not implemented.");
          }}
        />

        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{submitError}</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default DynamicSurveyForm;
