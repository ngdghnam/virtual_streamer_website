"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import SurveySection from "@/components/Sections/SurveySection";
import { OpenEndedQuestionStepProps } from "@/interfaces/iOpenEndedQuestionsStepProps";
import { putN8nWorkflowData } from "@/service/N8NService";

const OpenEndedQuestionStep: React.FC<OpenEndedQuestionStepProps> = ({
  questionsByType,
  responses,
  handleResponseChange,
  currentOpenEndedIndex,
  setCurrentOpenEndedIndex,
  onSurveySubmit,
}) => {
  const [showFollowUp, setShowFollowUp] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [followUpQuestion, setFollowUpQuestion] = React.useState("");

  const openEndedQuestions = questionsByType["open-ended"] || [];
  const currentQuestion = openEndedQuestions[currentOpenEndedIndex];

  const mainQuestionKey = currentQuestion?.question_id;
  const followUpKey = `extra_${mainQuestionKey}`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateSessionData = (newData: any) => {
    if (typeof window !== "undefined") {
      const sessionStr = sessionStorage.getItem("surveySession");
      const sessionData = sessionStr ? JSON.parse(sessionStr) : {};

      const mergedData = {
        ...sessionData,
        ...newData,
        responses: {
          ...(sessionData.responses || {}),
          ...(newData.responses || {}),
        },
      };

      sessionStorage.setItem("surveySession", JSON.stringify(mergedData));
    }
  };

  const isLastFollowUp = () => {
    return (
      currentOpenEndedIndex === openEndedQuestions.length - 1 && showFollowUp
    );
  };

  const handleNext = async () => {
    if (!currentQuestion) return;

    const userInput = responses[showFollowUp ? followUpKey : mainQuestionKey];
    if (!userInput?.trim()) return;

    const sessionStr = sessionStorage.getItem("surveySession");
    const sessionData = sessionStr ? JSON.parse(sessionStr) : {};

    try {
      setIsSubmitting(true);

      if (!showFollowUp) {
        // Step 1: Submit and get AI-generated follow-up question
        const updatedData = await putN8nWorkflowData(sessionData);
        const aiFollowUp =
          updatedData?.ai_agent_respone?.relevant_question || "";

        handleResponseChange(`ai_${mainQuestionKey}`, aiFollowUp);
        setFollowUpQuestion(aiFollowUp);
        setShowFollowUp(true);
        updateSessionData(updatedData);
      } else {
        await putN8nWorkflowData(sessionData);

        if (isLastFollowUp()) {
          sessionStorage.removeItem("surveySession");
          onSurveySubmit?.(); // Trigger thank-you screen
        } else {
          setCurrentOpenEndedIndex((prev) => prev + 1);
          setShowFollowUp(false);
          setFollowUpQuestion("");
        }
      }
    } catch (err) {
      console.error("Error during follow-up flow", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentQuestion) return null;

  return (
    <SurveySection title="Open-Ended Questions">
      <div className="space-y-4 py-2">
        <Label
          htmlFor={showFollowUp ? followUpKey : mainQuestionKey}
          className="text-base font-medium"
        >
          {showFollowUp
            ? followUpQuestion ||
              responses[`ai_${mainQuestionKey}`] ||
              "Đang tải câu hỏi tiếp theo..."
            : currentQuestion.question_text}
        </Label>

        <Textarea
          id={showFollowUp ? followUpKey : mainQuestionKey}
          value={responses[showFollowUp ? followUpKey : mainQuestionKey] || ""}
          onChange={(e) =>
            handleResponseChange(
              showFollowUp ? followUpKey : mainQuestionKey,
              e.target.value
            )
          }
          className="min-h-32"
          placeholder="Nhập câu trả lời của bạn..."
        />

        <div className="flex justify-between items-center mt-4">
          <Button
            type="button"
            variant="outline"
            disabled={currentOpenEndedIndex === 0 && !showFollowUp}
            onClick={() => {
              if (showFollowUp) {
                setShowFollowUp(false);
              } else {
                setCurrentOpenEndedIndex((prev) => Math.max(0, prev - 1));
              }
            }}
          >
            Câu trước
          </Button>

          <div className="text-sm text-gray-500">
            Câu {currentOpenEndedIndex + 1} / {openEndedQuestions.length}
            {showFollowUp && " (Follow-up)"}
          </div>

          <Button
            type="button"
            onClick={handleNext}
            disabled={
              isSubmitting ||
              !responses[showFollowUp ? followUpKey : mainQuestionKey]?.trim()
            }
          >
            {showFollowUp
              ? isLastFollowUp()
                ? "Hoàn tất"
                : "Tiếp tục"
              : "Gửi & Nhận Follow-up"}
          </Button>
        </div>
      </div>
    </SurveySection>
  );
};

export default OpenEndedQuestionStep;
