import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { JSX } from "react";
import { useAppSelector } from "@/redux/hooks";

type TabsExerciseProps = {
  study?: boolean;
};

export function TabsExercise({ study }: TabsExerciseProps) {
  const { exerciseSelected } = useAppSelector((state) => state.exerciseStatus);
  const renderTabsTrigger = (
    value: string,
    icon: JSX.Element,
    label: string
  ) => (
    <CarouselItem>
      <TabsTrigger value={value} className="gap-1">
        <span>{icon}</span>
        {label}
      </TabsTrigger>
    </CarouselItem>
  );

  return (
    <Tabs defaultValue="task" className="w-full flex flex-col h-full">
      <header className="flex h-12 items-center border-foreground border-b-[0.5px] bg-white">
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
              {renderTabsTrigger(
                "test-case",
                <MdOutlineTask size={20} />,
                "Test Case"
              )}
              {renderTabsTrigger("result", <GoTerminal size={20} />, "Results")}
            </CarouselContent>
            <CarouselNext />
          </Carousel>
        </TabsList>
      </header>

      <TabsContent value="task" className="flex-1">
        <div
          dangerouslySetInnerHTML={{
            __html: exerciseSelected?.exerciseId.content,
          }}
        ></div>
      </TabsContent>
      <TabsContent value="test-case" className="flex-1">
        <TabsTestCase />
      </TabsContent>
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
    </Tabs>
  );
}
