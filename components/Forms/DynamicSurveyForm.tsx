"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SurveyQuestion, SurveySession } from "@/types/survey";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useSurveySession } from "@/hooks/useSurveySession";

import DemographicStep from "./Steps/DemographicStep";
import PreliminaryStep from "./Steps/PreliminaryStep";
import BranchDetailsStep from "./Steps/BranchDetailsStep";
import OpenEndedQuestionStep from "./Steps/OpenEndedQuestionStep";

function DynamicSurveyForm() {
  const {
    session,
    questions,
    updateSession,
    isLoading,
    error
  } = useSurveySession();

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentOpenEndedIndex, setCurrentOpenEndedIndex] = useState(0);
  const [localSession, setLocalSession] = useState<SurveySession | null>(null);

  // Đồng bộ session từ hook vào local state
  useEffect(() => {
    if (session) {
      setLocalSession(session);
    }
  }, [session]);

  // Cập nhật responses khi chọn đáp án
  const handleResponseChange = (questionId: string, value: string) => {
    if (!localSession) return;

    const updatedSession = {
      ...localSession,
      responses: {
        ...(localSession.responses || {}),
        [questionId]: value
      }
    };

    sessionStorage.setItem("surveySession", JSON.stringify(updatedSession));
    setLocalSession(updatedSession);
  };

  const handleNextStep = async () => {
    setSubmitError(null); // reset error nếu có
  
    try {
      const updated = await updateSession();

      setLocalSession(updated); 
    } catch (err) {
      console.error("Failed to advance step:", err);
      setSubmitError("Failed to move to the next step. Try again.");
    }
  };
  

  // Gửi kết quả khi submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      await updateSession();

      setSubmitted(true);
    } catch (err) {
      console.error("Submit error:", err);
      setSubmitError("Failed to submit survey. Please try again.");
    } finally {
      setSubmitting(false);
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

  const handleNextOpenEndedQuestion = () => {
    const openEndedQuestions = questionsByType["open-ended"] || [];
    if (currentOpenEndedIndex < openEndedQuestions.length - 1) {
      setCurrentOpenEndedIndex(currentOpenEndedIndex + 1);
    }
  };

  if (isLoading || !localSession) return <div className="text-center py-8">Loading survey...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error initializing survey</div>;

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center">
        <Card className="shadow-sm bg-[#FAF8F8] p-8">
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
            <CardTitle className="text-2xl">Thank You!</CardTitle>
            <p className="text-gray-600">Your responses have been submitted.</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Start New Survey
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-8">
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

        <BranchDetailsStep
          questionsByType={questionsByType}
          responses={localSession.responses || {}}
          handleResponseChange={handleResponseChange}

        />

        <OpenEndedQuestionStep
          questionsByType={questionsByType}
          responses={localSession.responses || {}}
          handleResponseChange={handleResponseChange}
          currentOpenEndedIndex={currentOpenEndedIndex}
          setCurrentOpenEndedIndex={setCurrentOpenEndedIndex}
          handleNextOpenEndedQuestion={handleNextOpenEndedQuestion}

        />

        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{submitError}</span>
          </div>
        )}

        <Button
          type="submit"
          className="w-full py-6 text-lg font-medium mt-8"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Survey"
          )}
        </Button>
      </form>
    </div>
  );
}

const SurveySection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Card className="mb-8 shadow-sm hover:shadow-md transition-shadow duration-300 bg-[#FAF8F8]">
    <CardHeader className="border-b">
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6 pt-6">{children}</CardContent>
  </Card>
);

export default DynamicSurveyForm;
