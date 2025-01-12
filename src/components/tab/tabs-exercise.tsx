
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MdOutlineTask } from "react-icons/md";
import { ClipboardList, ClipboardPen } from "lucide-react";
import { GoTerminal } from "react-icons/go";
import { TabsTestCase } from "./tabs-test-case";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { JSX, use, useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/redux/hooks";

import { usePathname } from "next/navigation";
import PrismCode from "../prism-code";
import TabSubmission from "./tab-submission";
import { Spinner } from "../ui/spinner";
import { LoadingSpinner } from "../loading";
import { createSlug } from "@/lib/helper";
import TabsResult from "./tabs-result";
import { FaHistory } from "react-icons/fa";
import { MdOutlineIntegrationInstructions } from "react-icons/md";

type TabsExerciseProps = {
  study?: boolean;
};

export function TabsExercise({ study }: TabsExerciseProps) {
  const { exercise, loading, testCases, loadingTestCase, loadingSubList, compile, code } = useAppSelector(state => state.exercises)
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const isExerciseLoaded = exercise && exercise.testcases && exercise.testcases[0]?.input.length > 0;
  const [activeTab, setActiveTab] = useState("task");
  const carouselRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  // const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (loadingTestCase) {
      setActiveTab("result")
    } else if (compile == "Accepted" || compile == "Compile Error") {
      setActiveTab("compile")
      // setAccepted(true)
    }
  }, [loadingTestCase, compile]);

  useEffect(() => {
    console.log("compile", compile)
  }, [compile]);

  useEffect(() => {
    // Scroll to the active tab's carousel item
    const targetRef = carouselRefs.current[activeTab];
    if (targetRef) {
      targetRef.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    }
  }, [activeTab]);

  const renderTabsTrigger = (
    value: string,
    icon: JSX.Element,
    label: string
  ) => (
    <CarouselItem ref={(el: HTMLDivElement | null) => {
      carouselRefs.current[value] = el;
    }}>
      <TabsTrigger value={value} className="gap-1">
        {(loadingTestCase && value == "result") || (loadingSubList && value == "accepted") ? <LoadingSpinner /> : <span>{icon}</span>}
        {label}
      </TabsTrigger>
    </CarouselItem>
  );
  return (
    <Tabs defaultValue="task" value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col h-full relative">

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

              {isExerciseLoaded && renderTabsTrigger(
                "test-case",
                <MdOutlineTask size={20} />,
                "Test Case"
              )}
              {renderTabsTrigger("result", <GoTerminal size={20} />, "Results")}
              {study &&
                renderTabsTrigger(
                  "instruction",
                  <MdOutlineIntegrationInstructions size={20} />,
                  "Instruction"
                )}

              {renderTabsTrigger("submission", <FaHistory size={20} />, "Submission")}
              {(compile == "Accepted" || compile == "Compile Error") && renderTabsTrigger("compile", <FaHistory size={20} />, compile)}
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

      {(
        <TabsContent value="test-case" className="flex-1">
          <TabsTestCase />
        </TabsContent>
      )}


      <TabsContent value="result" className="mt-4">
        {testCases && testCases[exercise.title!] && testCases[exercise.title!].length > 0 && (
          testCases[exercise.title!][0].hasOwnProperty("output") ? (
            <div><TabsResult /> </div>
          ) : (
            <>
              {loadingTestCase ? (<LoadingSpinner />) : (<>
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
              </>)}
            </>


          )

        )}

      </TabsContent>
      <TabsContent value="submission" className="flex-1">
        <TabSubmission />
      </TabsContent>
      <TabsContent value="compile" className="flex-1">

        <div className="bg-white">
          <PrismCode code={code[`${exercise.title}`]} language={segments[1]} />
        </div>
      </TabsContent>
    </Tabs>
  );
}
