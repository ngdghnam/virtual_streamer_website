import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import SurveySection from "@/components/Sections/SurveySection";
import { OpenEndedQuestionStepProps } from "@/interfaces/iOpenEndedQuestionsStepProps";

const OpenEndedQuestionStep: React.FC<OpenEndedQuestionStepProps> = ({
  questionsByType,
  responses,
  handleResponseChange,
  currentOpenEndedIndex,
  setCurrentOpenEndedIndex,
  handleNextOpenEndedQuestion,
}) => {
  // Filter open-ended questions with group === "open-ended"
  const openEndedQuestions = (questionsByType["open_ended"] || []).filter(
    (q) => q.group === "open_ended"
  );

  return (
    <>
      {/* Open-Ended - Progressive Display */}
      {openEndedQuestions.length > 0 && (
        <SurveySection title="Open-Ended Questions">
          {(() => {
            const currentQuestion = openEndedQuestions[currentOpenEndedIndex];

            return (
              <div key={currentQuestion.question_id} className="space-y-4 py-2">
                <Label
                  htmlFor={currentQuestion.question_id}
                  className="text-base font-medium"
                >
                  {currentQuestion.question_text}
                </Label>
                <Textarea
                  id={currentQuestion.question_id}
                  value={responses[currentQuestion.question_id] || ""}
                  onChange={(e) =>
                    handleResponseChange(
                      currentQuestion.question_id,
                      e.target.value
                    )
                  }
                  className="min-h-32 transition-all duration-200"
                  placeholder="Share your thoughts..."
                />

                <div className="flex justify-between items-center mt-4">
                  <Button
                    type="button"
                    onClick={() =>
                      setCurrentOpenEndedIndex((prev) => Math.max(0, prev - 1))
                    }
                    variant="outline"
                    disabled={currentOpenEndedIndex === 0}
                  >
                    Previous Question
                  </Button>

                  <div className="text-sm text-gray-500">
                    Question {currentOpenEndedIndex + 1} of{" "}
                    {openEndedQuestions.length}
                  </div>

                  <Button
                    type="button"
                    onClick={handleNextOpenEndedQuestion}
                    variant="outline"
                    disabled={
                      currentOpenEndedIndex === openEndedQuestions.length - 1
                    }
                  >
                    Next Question
                  </Button>
                </div>
              </div>
            );
          })()}
        </SurveySection>
      )}
    </>
  );
};

export default OpenEndedQuestionStep;
