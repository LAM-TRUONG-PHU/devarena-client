
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
import { JSX, useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";

import { usePathname } from "next/navigation";
import PrismCode from "../prism-code";
import TabSubmission from "./tab-submission";
import { Spinner } from "../ui/spinner";
import { LoadingSpinner } from "../loading";
import { createSlug } from "@/lib/helper";
import TabsResult from "./tabs-result";

type TabsExerciseProps = {
  study?: boolean;
};

export function TabsExercise({ study }: TabsExerciseProps) {
  const { exercise, loading, testCases } = useAppSelector(state => state.exercises)
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const isExerciseLoaded = exercise && exercise.testcases && exercise.testcases[0]?.input.length > 0;

  const renderTabsTrigger = (
    value: string,
    icon: JSX.Element,
    label: string
  ) => (
    <CarouselItem>
      <TabsTrigger value={value} className="gap-1">
        {loading && value == "result" ? <LoadingSpinner /> : <span>{icon}</span>
        }
        {label}
      </TabsTrigger>
    </CarouselItem>
  );
  return (
    <Tabs defaultValue="task" className="w-full flex flex-col h-full relative">

      <header className="flex sticky top-0 h-12 items-center border-foreground border-b-[0.5px] bg-white">
        <TabsList className="w-full max-w-sm mx-auto">
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
              {study &&
                renderTabsTrigger(
                  "instruction",
                  <ClipboardList size={20} />,
                  "Instruction"
                )}

              {isExerciseLoaded && renderTabsTrigger(
                "test-case",
                <MdOutlineTask size={20} />,
                "Test Case"
              )}
              {renderTabsTrigger("result", <GoTerminal size={20} />, "Results")}
              {renderTabsTrigger("submission", <GoTerminal size={20} />, "Submission")}
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
          )

        )}

      </TabsContent>
<<<<<<< HEAD
      <TabsContent value="submission" className="flex-1">
        <TabSubmission />
      </TabsContent>
=======



>>>>>>> a7b1d7916a28fec823f60aa63e71fe061754da42
    </Tabs>
  );
}
