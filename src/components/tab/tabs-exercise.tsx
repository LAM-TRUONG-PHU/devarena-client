import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MdOutlineTask } from "react-icons/md";
import { ChevronsUpDown, ClipboardList, ClipboardPen } from "lucide-react";
import { GoTerminal } from "react-icons/go";
import { TabsTestCase } from "./tabs-test-case";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { JSX, use, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import { usePathname } from "next/navigation";
import PrismCode from "../prism-code";
import TabSubmission from "./tab-submission";
import { Spinner } from "../ui/spinner";
import { LoadingSpinner } from "../loading";
import { createSlug } from "@/lib/helper";
import TabsResult from "./tabs-result";
import { FaHistory } from "react-icons/fa";
import { MdOutlineIntegrationInstructions } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaRegClock } from "react-icons/fa6";
import { Separator } from "../ui/separator";
import { ChartRuntime } from "../study/chart-runtime";
import { capitalize } from "@/utils/capitalize";
import { Textarea } from "../ui/textarea";
import { StatusCompile } from "@/types/Exercise";

type TabsExerciseProps = {
    study?: boolean;
};

export function TabsExercise({ study }: TabsExerciseProps) {
    const {
        exercise,
        loading,
        testCases,
        loadingTestCase,
        loadingSubList,
        compile,
        code,
        resultSubmit,
        testCasesResult,
    } = useAppSelector((state) => state.exercises);
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);
    const isExerciseLoaded = exercise && exercise.testcases && exercise.testcases[0]?.input.length > 0;
    const [activeTab, setActiveTab] = useState("task");
    const carouselRefs = useRef<{ [key: string]: HTMLElement | null }>({});
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (compile == "Test Result" && activeTab !== "result") {
            setActiveTab("result");
        } else if (
            (compile == "Accepted" || compile == "Compile Error" || compile == "Wrong Answer") &&
            activeTab !== "compile"
        ) {
            setActiveTab("compile");
        }
    }, [compile]);

    console.log("resultSubmit", resultSubmit);

    useEffect(() => {
        // Scroll to the active tab's carousel item
        const targetRef = carouselRefs.current[activeTab];
        if (targetRef) {
            targetRef.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
        }
    }, [activeTab]);

    const renderTabsTrigger = (value: string, icon: JSX.Element, label: string) => (
        <CarouselItem
            ref={(el: HTMLDivElement | null) => {
                carouselRefs.current[value] = el;
            }}
        >
            <TabsTrigger value={value} className="gap-1">
                {(loadingTestCase && value == "result") || (loadingSubList && value == "accepted") ? (
                    <LoadingSpinner />
                ) : (
                    <span>{icon}</span>
                )}
                {label}
            </TabsTrigger>
        </CarouselItem>
    );
    return (
        <Tabs
            defaultValue="task"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full flex flex-col h-full relative"
        >
            <header className="flex sticky top-0  items-center border-foreground border-b-[0.5px] bg-white z-20">
                <TabsList className="w-full max-w-sm mx-auto h-12 flex items-center ">
                    <Carousel
                        opts={{ align: "center" }}
                        className="w-full"
                        onDrag={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <CarouselPrevious />

                        <CarouselContent>
                            {renderTabsTrigger("task", <ClipboardList size={20} />, "Task")}

                            {isExerciseLoaded &&
                                renderTabsTrigger("test-case", <MdOutlineTask size={20} />, "Test Case")}
                            {renderTabsTrigger("result", <GoTerminal size={20} />, "Results")}
                            {study &&
                                renderTabsTrigger(
                                    "instruction",
                                    <MdOutlineIntegrationInstructions size={20} />,
                                    "Instruction"
                                )}

                            {renderTabsTrigger("submission", <FaHistory size={20} />, "Submission")}
                            {(compile == "Accepted" ||
                                compile == "Compile Error" ||
                                compile == "Wrong Answer") &&
                                renderTabsTrigger("compile", <FaHistory size={20} />, compile)}
                        </CarouselContent>
                        <CarouselNext />
                    </Carousel>
                </TabsList>
            </header>

            <TabsContent value="task" className="flex-1 p-4">
                <div
                    dangerouslySetInnerHTML={{
                        __html: exercise.content,
                    }}
                ></div>
            </TabsContent>
            <TabsContent value="instruction" className="flex-1">
                <PrismCode code={exercise.solution!} language={segments[1]} />
            </TabsContent>

            {
                <TabsContent value="test-case" className="flex-1">
                    <TabsTestCase />
                </TabsContent>
            }

            <TabsContent value="result" className="mt-4">
                {testCases &&
                    testCases[exercise.title!] &&
                    testCases[exercise.title!].length > 0 &&
                    (testCases[exercise.title!][0].hasOwnProperty("output") ? (
                        <div>
                            <TabsResult />{" "}
                        </div>
                    ) : (
                        <>
                            {loadingTestCase ? (
                                <LoadingSpinner />
                            ) : (
                                <>
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
                                </>
                            )}
                        </>
                    ))}
            </TabsContent>
            <TabsContent value="submission" className="flex-1">
                <TabSubmission />
            </TabsContent>
            <TabsContent value="compile" className="flex-1 p-4 bg-white space-y-2">
                <div className="space-y-2">
                    <div className="flex items-center space-x-1">
                        <div
                            className={`${
                                compile == "Accepted" ? "text-green_primary" : "text-red_primary"
                            } font-semibold text-lg`}
                        >
                            {compile}
                        </div>
                        {compile == "Accepted" && (
                            <div className="text-sm ">{resultSubmit.result} testcases passed</div>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={"/avatar.jpg"} alt={""} className="rounded-full object-cover" />
                            <AvatarFallback> {"Phu"}</AvatarFallback>
                        </Avatar>

                        <div className="text-left text-sm leading-tight">
                            <span className="truncate font-semibold">{"Phu"} </span>
                            submitted at {resultSubmit?.submittedAt}
                        </div>
                    </div>
                    <div className="p-4 !bg-gray-100 !rounded-xl">
                        {compile == "Accepted" ? (
                            <>
                                <div className="flex gap-1 items-center">
                                    <FaRegClock />
                                    <div>Runtime</div>
                                </div>
                                <div className="flex items-center">
                                    <div>
                                        <span className="font-semibold text-lg">
                                            {resultSubmit?.totalRuntime &&
                                                Number(resultSubmit?.totalRuntime / 1000).toFixed(2)}
                                        </span>{" "}
                                        s{" "}
                                    </div>
                                    <Separator orientation="vertical" className="mx-2 h-6" />
                                    <div>
                                        Beats
                                        <span className="font-semibold text-lg">
                                            {" "}
                                            {Number(resultSubmit?.compareTime).toFixed(2)}
                                        </span>{" "}
                                        %
                                    </div>
                                </div>
                                <ChartRuntime />
                            </>
                        ) : compile == "Wrong Answer" ? (
                            <>
                                <div className="font-semibold text-lg">Output</div>
                                {resultSubmit.testcases?.map((testCase, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="bg-white w-full text-gray-800 p-4 flex flex-col gap-4"
                                        >
                                            {testCase.input.map((obj, index) => {
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
                                            <div>
                                                <div>Output</div>
                                                <Textarea
                                                    className="w-full p-3 rounded-xl"
                                                    value={testCase.output}
                                                    disabled
                                                />
                                            </div>
                                            <div>
                                                <div>Expected</div>
                                                <Textarea
                                                    className="w-full p-3 rounded-xl"
                                                    value={testCase.outputExpected}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        ) : (
                            <>
                                <PrismCode code={resultSubmit.codeFailed || ""} language={segments[1]} />
                            </>
                        )}
                    </div>
                </div>

                <div>
                    <div className="font-medium">Code | {capitalize(segments[1])}</div>
                    <PrismCode code={code[`${exercise.title}`]} language={segments[1]} />
                </div>
            </TabsContent>
        </Tabs>
    );
}
