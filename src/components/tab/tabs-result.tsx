import { StatusCompile } from "@/types/Exercise";
import { Tabs, TabsContent } from "../ui/tabs";
import React, { useEffect, useRef, useState } from "react";
import { TabsList, TabsTrigger } from "../ui/tabs";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { usePathname } from "next/navigation";
import { createSlug } from "@/lib/helper";
import { CheckCircle, ClipboardPen, XCircle } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "../loading";
import { setActiveResultTab, setActiveTab, setCompile } from "@/redux/slices/admin/exerciseStudySlice";

export default function TabsResult() {
    const { testCasesResult, activeResultTab } = useAppSelector(
        (state) => state.exercises
    );
    const dispatch = useAppDispatch();
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);
    const lastRunningTestId = useRef<string | null>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const renderStatusIcon = (status: StatusCompile) => {
        switch (status) {
            case StatusCompile.COMPILE_SUCCESS:
                return <CheckCircle />;
            case StatusCompile.COMPILE_FAILED:
                return <XCircle />;
            case StatusCompile.COMPILE_RUNNING:
                return <Spinner size="small" />;
            default:
                return "";
        }
    };

    useEffect(() => {
        if (!testCasesResult || Object.keys(testCasesResult).length === 0) return;

        let foundRunningTest = false;

        for (const [, testCaseGroup] of Object.entries(testCasesResult)) {
            const runningTest = testCaseGroup.find(
                (testCase) => testCase.statusCompile === StatusCompile.COMPILE_RUNNING
            );


            if (runningTest) {

                if (lastRunningTestId.current !== runningTest._id) {
                    lastRunningTestId.current = runningTest._id; // Update last recorded running test ID
                    dispatch(setActiveResultTab(runningTest._id));
                }
                foundRunningTest = true;
                break; // Stop after finding the first running test case
            }
        }

        // Reset lastRunningTestId if no running test is found (prevents flickering)
        if (!foundRunningTest) {
            lastRunningTestId.current = null;
        }
    }, [testCasesResult, dispatch]);

    useEffect(() => {
        console.log("activeResultTab", activeResultTab);
    }, [activeResultTab]);

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight;
        }
    }, [testCasesResult]);

    return (
        <div>
            <Tabs
                defaultValue={activeResultTab || Object.entries(testCasesResult)[0][1][0]._id}
                value={activeResultTab}
                onValueChange={
                    (value) => {
                        dispatch(setActiveResultTab(value))
                    }
                }
                className="w-full flex flex-col h-full pt-2 "
            >

                <header className="flex items-center px-4 bg-transparent ">
                    <TabsList className="bg-transparent">
                        {testCasesResult && Object.entries(testCasesResult).length > 0 ? (
                            Object.entries(testCasesResult).map(([key, testCaseGroup]) => (
                                // Replace the key with a dynamic key if needed
                                <div
                                    key={key}
                                    className="flex flex-wrap gap-4 bg-transparent justify-start pb-4"
                                >
                                    {createSlug(key) === segments[segments.length - 1] && (
                                        <>
                                            {testCaseGroup.map((tab, i) => (
                                                <div key={tab._id} className="relative group">
                                                    <TabsTrigger
                                                        value={tab._id}
                                                        className={`relative ${tab.statusCompile ===
                                                            StatusCompile.COMPILE_SUCCESS
                                                            ? "data-[state=active]:bg-green_secondary data-[state=active]:border data-[state=active]:border-green_primary data-[state=active]:text-green_primary text-green_primary"
                                                            : tab.statusCompile ===
                                                                StatusCompile.COMPILE_FAILED
                                                                ? "data-[state=active]:bg-red_secondary data-[state=active]:border data-[state=active]:border-red_primary data-[state=active]:text-red_primary text-red_primary"
                                                                : tab.statusCompile ===
                                                                    StatusCompile.COMPILE_RUNNING
                                                                    ? "data-[state=active]:bg-yellow_secondary data-[state=active]:border data-[state=active]:border-yellow_primary data-[state=active]:text-yellow_primary text-yellow_primary"
                                                                    : ""
                                                            }`}
                                                    >
                                                        {renderStatusIcon(tab.statusCompile!)}

                                                        {`Case ${i + 1}`}
                                                    </TabsTrigger>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div>loading</div>
                        )}
                    </TabsList>
                </header>

                <>
                    {testCasesResult && Object.entries(testCasesResult).length > 0 ? (
                        Object.entries(testCasesResult).map(([groupKey, testCaseGroup]) => (
                            <div key={groupKey}>
                                {createSlug(groupKey) === segments[segments.length - 1] && (
                                    <>
                                        {testCaseGroup.map((tab, index) => (
                                            <TabsContent
                                                key={tab._id}
                                                value={tab._id}
                                                className="flex-1"
                                            >
                                                {tab.statusCompile === StatusCompile.COMPILE_RUNNING ? (
                                                    <div className="relative">
                                                        {/* <div className="absolute inset-0 flex justify-center items-center bg-white/50 z-10">
                              <LoadingSpinner />
                            </div> */}
                                                        <div className="bg-white w-full text-gray-800 p-4 flex flex-col gap-4">
                                                            {tab.input.map((obj, index) => {
                                                                const key = Object.keys(obj)[0];
                                                                const value = obj[key];
                                                                return (
                                                                    <div key={index}>
                                                                        <div>{key} =</div>
                                                                        <Textarea
                                                                            disabled
                                                                            value={value}
                                                                            className="w-full p-3 rounded-xl bg-[#000a200d] outline-none !min-h-[80px]"
                                                                        />
                                                                    </div>
                                                                );
                                                            })}
                                                            <div>
                                                                <div>Output = </div>
                                                                <Textarea
                                                                    className="w-full p-3 rounded-xl outline-none "
                                                                    value={tab.output}
                                                                    disabled
                                                                    ref={textAreaRef}
                                                                />
                                                            </div>
                                                            <div>
                                                                <div>Expected Output = </div>
                                                                <Textarea
                                                                    className="w-full p-3 rounded-xl outline-none"
                                                                    value={tab.outputExpected}
                                                                    disabled
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="bg-white w-full text-gray-800 p-4 flex flex-col gap-4">
                                                        {tab.input.map((obj, index) => {
                                                            const key = Object.keys(obj)[0];
                                                            const value = obj[key];
                                                            return (
                                                                <div key={index}>
                                                                    <div>{key} =</div>
                                                                    <Textarea
                                                                        disabled
                                                                        value={value} // Display initial value
                                                                        className="w-full p-3 rounded-xl bg-[#000a200d] outline-none"
                                                                    />
                                                                </div>
                                                            );
                                                        })}

                                                        {(tab.statusCompile ===
                                                            StatusCompile.COMPILE_SUCCESS ||
                                                            tab.statusCompile ===
                                                            StatusCompile.COMPILE_FAILED) && (
                                                                <>
                                                                    <div>
                                                                        <div>Output = </div>

                                                                        <Textarea
                                                                            className="w-full p-3 rounded-xl outline-none"
                                                                            value={tab.output}
                                                                            disabled
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <div>Expected Output = </div>
                                                                        <Textarea
                                                                            className="w-full p-3 rounded-xl outline-none"
                                                                            value={tab.outputExpected}
                                                                            disabled
                                                                        />
                                                                    </div>
                                                                </>
                                                            )}
                                                    </div>
                                                )}
                                            </TabsContent>
                                        ))}
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        <TabsContent value="result" className="mt-4">
                            <div className="flex justify-center my-4">
                                <ClipboardPen size={60} />
                            </div>
                            <div className="font-semibold text-lg text-center">
                                Run tests to check your code
                            </div>
                            <div className="text-center">
                                Run your code against tests to check whether <br />
                                it works, then give you the results here.
                            </div>
                        </TabsContent>
                    )}
                </>
            </Tabs>
        </div>
    );
}