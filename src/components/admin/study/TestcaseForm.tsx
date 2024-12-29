import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ComboboxDemo } from "@/components/ui/ComboBoxType";

const TestcaseForm = () => {
    const dispatch = useAppDispatch();
    const { exercise } = useAppSelector((state) => state.studyForm);

    const [testcases, setTestcases] = useState(
        [{ values: exercise.variableName!.map(() => "") }] // Mỗi testcase là 1 khung gồm các giá trị cho variableName
    );

    const handleInputChange = (testcaseIndex: number, variableIndex: number, value: string) => {
        setTestcases((prev) =>
            prev.map((testcase, i) =>
                i === testcaseIndex
                    ? {
                          ...testcase,
                          values: testcase.values.map((v, j) => (j === variableIndex ? value : v)),
                      }
                    : testcase
            )
        );
    };

    const handleAddTestcase = () => {
        setTestcases((prev) => [...prev, { values: exercise.variableName!.map(() => "") }]);
    };

    return (
        <div className="flex flex-col space-y-4">
            {testcases.map((testcase, testcaseIndex) => (
                <div key={testcaseIndex} className="p-4 border border-gray-300 rounded flex flex-col">
                    <h4 className="mb-2 font-semibold">Testcase {testcaseIndex + 1}</h4>
                    <div className="flex flex-col space-y-2">
                        {exercise.variableName!.map((variable, variableIndex) => (
                            <div key={variableIndex} className="flex items-center space-x-2">
                                <span className="w-24">{variable}</span>
                                <input
                                    type="text"
                                    value={testcase.values[variableIndex]}
                                    onChange={(e) =>
                                        handleInputChange(testcaseIndex, variableIndex, e.target.value)
                                    }
                                    className="p-2 border rounded flex-1"
                                    placeholder={`Enter value for ${variable}`}
                                />
                                <ComboboxDemo />
                            </div>
                        ))}
                    </div>
                    <div>
                        <span>Output</span>
                        <input type="text" placeholder={`Enter for output`} />
                    </div>
                    <div>
                        <Label title="Hidden?" />
                        <Switch />
                    </div>
                </div>
            ))}
            <button
                type="button"
                onClick={handleAddTestcase}
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                + Add Testcase
            </button>
        </div>
    );
};

export default TestcaseForm;
