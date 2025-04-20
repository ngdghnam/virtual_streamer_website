"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import SurveySection from "@/components/Sections/SurveySection";
import { DemographicStepProps } from "@/interfaces/iDemographicStepProps";



const DemographicStep: React.FC<DemographicStepProps> = ({
  questionsByType,
  responses,
  handleResponseChange,
  onNextStep,
}) => {
  const singleChoiceQuestions = questionsByType["single-choice"] || [];

  // Kiểm tra đã trả lời hết chưa
  const allAnswered = singleChoiceQuestions.every(
    (q) => responses[q.question_id]?.trim() !== ""
  );

  return (
    <>
      {singleChoiceQuestions.length > 0 && (
        <SurveySection title="Demographic">
          {singleChoiceQuestions.map((q) => (
            <div key={q.question_id} className="space-y-4 py-2">
              <Label htmlFor={q.question_id} className="text-base font-medium">
                {q.question_text}
              </Label>
              <RadioGroup
                onValueChange={(val) => handleResponseChange(q.question_id, val)}
                value={responses[q.question_id] || ""}
                className="mt-2 space-y-2"
              >
                {q.options.map((option) => {
                  const trimmed = option.trim();
                  const id = `${q.question_id}-${trimmed}`;
                  return (
                    <div
                      key={id}
                      className="flex items-center space-x-3 p-2 rounded-md"
                    >
                      <RadioGroupItem
                        value={trimmed}
                        id={id}
                        className="border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-blue-500"
                      />
                      <Label htmlFor={id} className="cursor-pointer">
                        {trimmed}
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
      )}
    </>
  );
};

export default DemographicStep;
