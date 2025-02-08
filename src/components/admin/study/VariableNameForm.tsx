"use client";

import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setVariableCount } from "@/redux/slices/admin/StudyFormSlice";
import { setVariableName } from "@/redux/slices/admin/exerciseStudySlice";
const VariableNameForm = () => {
  const { variableCount, } = useAppSelector((state) => state.studyForm);
  const dispatch = useAppDispatch();
  const { exercise, variableName } = useAppSelector((state) => state.exercises);




  const handleVariableCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const count = parseInt(value, 10);

    if (!isNaN(count) && count >= 0) {
      dispatch(setVariableCount(count));
      dispatch(setVariableName(Array(count).fill("")));
    } else {
      dispatch(setVariableCount(0));
      dispatch(setVariableName([]));
    }
  };

  const handleVariableNameChange = (index: number, value: string) => {
    const updatedVariableNames = [...(exercise.variableName || [])];
    updatedVariableNames[index] = value;
    dispatch(setVariableName(updatedVariableNames));
  };

  console.log("exercise.variableName", exercise.variableName);

  return (
    <div>
      <div className="mb-6">
        <Label htmlFor="variable-count">Number of Variables</Label>
        <Input
          id="variable-count"
          type="number"
          min="0"
          value={variableCount?.toString() || ""}
          onChange={handleVariableCountChange}
          placeholder="Enter number of variables"
        />
      </div>

      {variableCount > 0 && (
        <div>
          {Array.from({ length: variableCount }).map((_, index) => (
            <div key={index} className="flex gap-4 mt-4">
              <Input
                placeholder={`Enter variable ${index + 1} name`}
                value={exercise.variableName?.[index] || ""}
                onChange={(e) => handleVariableNameChange(index, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VariableNameForm;
