import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import SurveySection from "@/components/Sections/SurveySection";
import { ExtraPreliminaryStepProps } from "@/interfaces/iExtraPreliminaryStepProps";

const ExtraPreliminaryStep: React.FC<ExtraPreliminaryStepProps> = ({
  questionsByType,
  responses,
  handleResponseChange,
  onNextStep,
}) => {
  const extraPreliminaryQuestions = React.useMemo(() => {
    if (!questionsByType["single-choice"]) return [];

    return questionsByType["single-choice"].filter(
      (q) => q.group === "extra_preliminary"
    );
  }, [questionsByType]);

  if (extraPreliminaryQuestions.length === 0) {
    return null;
  }


  // Check if all questions are answered
  const allAnswered = extraPreliminaryQuestions.every(
    (q) => responses[q.question_id]?.trim() !== ""
  );

  

  return (
    <SurveySection title="Extra Preliminary">
      {extraPreliminaryQuestions.map((q) => (
        <div key={q.question_id} className="space-y-4 py-2">
          <Label htmlFor={q.question_id} className="text-base font-medium">
            {q.question_text}
          </Label>
          <RadioGroup
            onValueChange={(val) => handleResponseChange(q.question_id, val.toLowerCase())}
            value={responses[q.question_id] || ""}
            className="mt-2 space-y-2"
          >
            {["Yes", "No"].map((option) => {
              const id = `${q.question_id}-${option}`;
              return (
                <div
                  key={id}
                  className="flex items-center space-x-3 p-2 rounded-md"
                >
                  <RadioGroupItem
                    value={option}
                    id={id}
                    className="border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-blue-500"
                  />
                  <Label htmlFor={id} className="cursor-pointer">
                    {option}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </div>
      ))}

      {onNextStep && (
            <div className="pt-4">
              <Button
                type="button"
                onClick={onNextStep}
                disabled={!allAnswered}
              >
                Next
              </Button>
            </div>
          )}

            
    </SurveySection>
  );
};

export default ExtraPreliminaryStep;
