"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import SurveySection from "@/components/Sections/SurveySection";
import { DemographicStepProps } from "@/interfaces/iDemographicStepProps";

const DemographicStep: React.FC<DemographicStepProps> = ({
  questionsByType,
  responses,
  handleResponseChange,
}) => {
  // Filter out the last question for single-choice type
  const filteredQuestionsByType = React.useMemo(() => {
    const filtered = { ...questionsByType };

    if (filtered["single-choice"] && filtered["single-choice"].length > 0) {
      filtered["single-choice"] = filtered["single-choice"].slice(0, -1);
    }

    return filtered;
  }, [questionsByType]);

  return (
    <>
      {/* Single Choice */}
      {filteredQuestionsByType["single-choice"] &&
        filteredQuestionsByType["single-choice"].length > 0 && (
          <SurveySection title="Thông tin cá nhân">
            {filteredQuestionsByType["single-choice"].map((q) => (
              <div key={q.question_id} className="space-y-4 py-2">
                <Label
                  htmlFor={q.question_id}
                  className="text-base font-medium"
                >
                  {q.question_text}
                </Label>
                <RadioGroup
                  onValueChange={(val) =>
                    handleResponseChange(q.question_id, val)
                  }
                  value={responses[q.question_id]}
                  className="mt-2 space-y-2"
                >
                  {q.options.split(",").map((option: string) => {
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
          </SurveySection>
        )}
    </>
  );
};

export default DemographicStep;
