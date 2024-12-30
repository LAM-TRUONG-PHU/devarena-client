"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setVariableName, setVariableCount } from "@/redux/slices/admin/StudyFormSlice";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { TExerciseStudy } from "@/app/admin/study/[slug]/create-exercise/page";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

type VariableNameFormProps = {
  form: UseFormReturn<
    TExerciseStudy,
    any,
    undefined
  >;
}

const typeOptions = [
  { value: "array", label: "Array" },
  { value: "string", label: "String" },
  { value: "integer", label: "Integer" },
  { value: "float", label: "Float" },
  { value: "double", label: "Double" },
  { value: "boolean", label: "Boolean" },
  { value: "object", label: "Object" },
  { value: "function", label: "Function" },
  { value: "undefined", label: "Undefined" },
  { value: "null", label: "Null" },
];



const VariableNameForm = (props: VariableNameFormProps) => {
  // const [variableCount, setVariableCount] = useState<string>("");
  const { exercise, variableCount } = useAppSelector((state) => state.studyForm)
  //   const [variableNames, setVariableNames] = useState<string[]>([]);
  const dispatch = useAppDispatch()
  //   const [numberTc, setNumberTc] = useState<string>("");

  const handleVariableCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const count = parseInt(value, 10);

    if (!isNaN(count) && count >= 0) {
      dispatch(setVariableCount(count));
      const updatedVariableNames = Array(count).fill("");
      dispatch(setVariableName(updatedVariableNames));
    } else {
      dispatch(setVariableCount(0));
      dispatch(setVariableName([]));
    }
  };
  const handleVariableNameChange = (index: number, value: string) => {
    const newVariableNames = [...(exercise.variableName || [])];
    newVariableNames[index] = value;
    dispatch(setVariableName(newVariableNames));
  };

  const renderVariableInputs = () => {
    return exercise.variableName!.map((name, index) => (
      <div key={index} className="flex gap-4 mt-4">
        <Input
          placeholder={`Enter variable ${index + 1} name`}
          value={name}
          onChange={(e) => {
            handleVariableNameChange(index, e.target.value);
          }}
        />
      </div>
    ));
  };

  return (
    <div>

      <div className="mb-6">
        <Label htmlFor="variable-count">Number of Variables</Label>
        <Input
          id="variable-count"
          type="number"
          min="0"

          value={variableCount.toString()}
          onChange={handleVariableCountChange}
          placeholder="Enter number of variables"
        />

      </div>

      {renderVariableInputs()}

    </div>
  );
};

export default VariableNameForm;
