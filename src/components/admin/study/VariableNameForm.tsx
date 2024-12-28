"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setVariableName } from "@/redux/slices/admin/StudyFormSlice";

const VariableNameForm = () => {
  const [variableCount, setVariableCount] = useState<string>("");
    const {exercise}=useAppSelector((state)=>state.studyForm)
  //   const [variableNames, setVariableNames] = useState<string[]>([]);
    const dispatch = useAppDispatch()
//   const [numberTc, setNumberTc] = useState<string>("");

  const handleVariableCountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setVariableCount(value);
    const count = parseInt(value, 10);
    if (!isNaN(count) && count >= 0) {
        dispatch(setVariableName(Array(count).fill("")));
    } else {
        dispatch(setVariableName([]));
    }
  };

  const handleVariableNameChange = (index: number, value: string) => {
    const newVariableNames = [...exercise.variableName];
    newVariableNames[index] = value;
    dispatch(setVariableName(newVariableNames));
  };

  const renderVariableInputs = () => {
    return exercise.variableName.map((name, index) => (
      <div key={index} className="mb-4">
        <Label htmlFor={`variable-${index}`}>Variable {index + 1} Name</Label>
        <Input
          id={`variable-${index}`}
          value={name}
          onChange={(e) => handleVariableNameChange(index, e.target.value)}
          placeholder={`Enter variable ${index + 1} name`}
        />
      </div>
    ));
  };

  return (
    <div>
      <div>
        <div className="mb-6">
          <Label htmlFor="variable-count">Number of Variables</Label>
          <Input
            id="variable-count"
            type="number"
            min="0"
            value={variableCount}
            onChange={handleVariableCountChange}
            placeholder="Enter number of variables"
          />
        </div>
        {renderVariableInputs()}
      </div>
    </div>
  );
};

export default VariableNameForm;
