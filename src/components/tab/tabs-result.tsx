import { StatusCompile } from '@/types/Exercise';
import { Tabs, TabsContent } from '../ui/tabs';
import React, { useEffect, useState } from 'react'
import { TabsList, TabsTrigger } from '../ui/tabs';
import { useAppSelector } from '@/redux/hooks';
import { usePathname } from 'next/navigation';
import { createSlug } from '@/lib/helper';
import { CheckCircle, ClipboardPen, XCircle } from 'lucide-react';
import { Spinner } from '../ui/spinner';
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from '../loading';

export default function TabsResult() {
    const [activeTab, setActiveTab] = useState("1");
    const { testCasesResult, loading, loadingTestCase } = useAppSelector(state => state.exercises)
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);


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
    return (
        <div>

            <Tabs
                defaultValue={activeTab}
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full flex flex-col h-full pt-2 "
            >
                {loadingTestCase ? (
                    <LoadingSpinner />
                ) : (<header className="flex items-center px-4 bg-transparent ">
                    <TabsList className="bg-transparent">
                        {testCasesResult && Object.entries(testCasesResult).length > 0 ? (
                            Object.entries(testCasesResult).map(([key, testCaseGroup]) => (
                                // Replace the key with a dynamic key if needed 
                                <div key={key} className="flex flex-wrap gap-4 bg-transparent justify-start pb-4">
                                    {createSlug(key) === segments[segments.length - 1] && (
                                        <> {testCaseGroup.map((tab, i) => (
                                            <div key={tab._id} className="relative group">
                                                <TabsTrigger
                                                    value={tab._id}
                                                    className={`relative ${tab.statusCompile === StatusCompile.COMPILE_SUCCESS
                                                        ? "bg-green-200 text-green-600"
                                                        : tab.statusCompile === StatusCompile.COMPILE_FAILED
                                                            ? "bg-red-500"
                                                            : tab.statusCompile === StatusCompile.COMPILE_RUNNING
                                                                ? "bg-yellow-500"
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
                </header>)}


                {loadingTestCase ? (<></>) : (
                    <>
                        {testCasesResult && Object.entries(testCasesResult).length > 0 ? (
                            Object.entries(testCasesResult).map(([groupKey, testCaseGroup]) => (
                                <div key={groupKey}>
                                    {createSlug(groupKey) === segments[segments.length - 1] && (<>
                                        {testCaseGroup.map((tab, index) => (
                                            <TabsContent key={tab._id} value={tab._id} className="flex-1">
                                                <div className="bg-white w-full text-gray-800 p-4 flex flex-col gap-4">
                                                    {tab.input.map((obj, index) => {
                                                        const key = Object.keys(obj)[0]; // Extract key from object
                                                        const value = obj[key]; // Extract value
                                                        return (
                                                            <div key={index}>
                                                                <div>{key} =</div>
                                                                <input
                                                                    disabled
                                                                    type="text"
                                                                    value={value} // Display initial value
                                                                    className="w-full p-3 rounded-xl bg-[#000a200d] outline-none"
                                                                />
                                                            </div>
                                                        );
                                                    })}

                                                    {(tab.statusCompile === StatusCompile.COMPILE_SUCCESS ||
                                                        tab.statusCompile === StatusCompile.COMPILE_FAILED) && (
                                                            <>
                                                                <div>
                                                                    <div>Output = </div>

                                                                    <Textarea
                                                                        className="w-full p-3 rounded-xl outline-none"
                                                                        value={tab.output}
                                                                        disabled />
                                                                </div>
                                                                <div>
                                                                    <div>Expected Output = </div>
                                                                    <Textarea
                                                                        className="w-full p-3 rounded-xl outline-none"
                                                                        value={tab.outputExpected}
                                                                        disabled />
                                                                </div>
                                                            </>
                                                        )}
                                                </div>
                                            </TabsContent>
                                        ))}</>)}

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
                )}



            </Tabs>
        </div>
    )
}
