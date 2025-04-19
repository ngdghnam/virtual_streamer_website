"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import SurveySection from "@/components/Sections/SurveySection";
import { PreliminaryStepProps } from "@/interfaces/iPreliminaryStepProps";

const PreliminaryStep: React.FC<PreliminaryStepProps> = ({
  questionsByType,
  responses,
  handleResponseChange,
}) => {
  return (
    <SurveySection title="Preliminary">
      {/* Multiple Select Questions */}
      {questionsByType["multiple select question"] &&
        questionsByType["multiple select question"].map((q) => (
          <div key={q.question_id} className="space-y-4 py-2">
            <Label className="text-base font-medium">{q.question_text}</Label>
            <div className="space-y-2 mt-2">
              {q.options.split(",").map((option: string) => {
                const trimmed = option.trim();
                const id = `${q.question_id}-${trimmed}`;
                const selected = responses[q.question_id]?.split(",") || [];
                return (
                  <div
                    key={id}
                    className="flex items-center space-x-3 p-2 rounded-md"
                  >
                    <Checkbox
                      id={id}
                      checked={selected.includes(trimmed)}
                      onCheckedChange={(checked) => {
                        const updated = checked
                          ? [...selected, trimmed]
                          : selected.filter((item) => item !== trimmed);
                        handleResponseChange(q.question_id, updated.join(","));
                      }}
                      className="border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-blue-500"
                    />
                    <Label htmlFor={id} className="cursor-pointer">
                      {trimmed}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

      {/* Likert Scale Questions */}
      {questionsByType["likert"] &&
        questionsByType["likert"].map((q) => (
          <div key={q.question_id} className="space-y-4 py-2">
            <Label className="text-base font-medium">{q.question_text}</Label>
            <RadioGroup
              onValueChange={(val) => handleResponseChange(q.question_id, val)}
              value={responses[q.question_id]}
              className="flex justify-between mt-3 px-6"
            >
              {[1, 2, 3, 4, 5].map((num) => {
                const id = `${q.question_id}-${num}`;
                return (
                  <div
                    key={id}
                    className="flex flex-col items-center space-y-1"
                  >
                    <RadioGroupItem
                      value={num.toString()}
                      id={id}
                      className="border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-blue-500"
                    />
                    <Label htmlFor={id} className="text-sm">
                      {num}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
            <div className="flex justify-between text-sm text-gray-500 px-4 mt-1">
              <span>Strongly Disagree</span>
              <span>Strongly Agree</span>
            </div>
          </div>
        ))}
    </SurveySection>
  );
};

export default PreliminaryStep;
