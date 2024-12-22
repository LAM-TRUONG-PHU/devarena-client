"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TestcaseForm = () => {
  const [variableCount, setVariableCount] = useState<string>("");
  const [variableNames, setVariableNames] = useState<string[]>([]);

  const [numberTc, setNumberTc] = useState<string>("");

  const handleVariableCountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setVariableCount(value);
    const count = parseInt(value, 10);
    if (!isNaN(count) && count >= 0) {
      setVariableNames(Array(count).fill(""));
    } else {
      setVariableNames([]);
    }
  };

  const handleVariableNameChange = (index: number, value: string) => {
    const newVariableNames = [...variableNames];
    newVariableNames[index] = value;
    setVariableNames(newVariableNames);
  };

  const renderVariableInputs = () => {
    return variableNames.map((name, index) => (
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
      <div>
        <div className="mb-6">
          <Label htmlFor="variable-count">Number of Testcase</Label>
          <Input
            id="variable-count"
            type="number"
            min="0"
            value={variableCount}
            onChange={handleVariableCountChange}
            placeholder="Enter number of variables"
          />
        </div>
      </div>
    </div>
  );
};

export default TestcaseForm;
