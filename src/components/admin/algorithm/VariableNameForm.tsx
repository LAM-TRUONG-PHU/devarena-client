"use client";

import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setVariableCount } from "@/redux/slices/admin/StudyFormSlice";
import { setVariableNameAlgorithm } from "@/redux/slices/admin/exerciseStudySlice";
const VariableNameForm = () => {
  const { variableCount } = useAppSelector((state) => state.studyForm);
  const dispatch = useAppDispatch();
  const { algoExercise } = useAppSelector((state) => state.exercises);



  const handleVariableCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const count = parseInt(value, 10);

    if (!isNaN(count) && count >= 0) {
      dispatch(setVariableCount(count));
      dispatch(setVariableNameAlgorithm(Array(count).fill("")));
    } else {
      dispatch(setVariableCount(0));
      dispatch(setVariableNameAlgorithm([]));
    }
  };



  const handleVariableNameChange = (index: number, value: string) => {
    // 1. Create a *copy* of the existing array
    console.log("value",)
    const updatedVariableNames = [...(algoExercise.variableName || [])]; // Use spread operator to create a new array

    // 2. Update the *copy*
    updatedVariableNames[index] = value;

    // 3. Dispatch the *new* array
    dispatch(setVariableNameAlgorithm(updatedVariableNames));
  };
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
                value={algoExercise.variableName?.[index] || ""}
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
