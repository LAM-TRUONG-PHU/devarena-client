import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, ClipboardPen } from "lucide-react";
import { IoIosCloseCircle } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ITestCase, StatusCompile } from "@/types/Exercise";
import {
  addTestCase,
  handleChangeInputTestCase,
  removeTestCase,
  setActiveTestcaseTab,
  setTestCases,
} from "@/redux/slices/admin/exerciseStudySlice";
import { Spinner } from "../ui/spinner";
import { usePathname } from "next/navigation";
import { createSlug } from "@/lib/helper";
import { create } from "domain";
import { Textarea } from "../ui/textarea";
import { C } from "../mastery";

export function TabsTestCase() {
  const dispatch = useAppDispatch();
  const path = usePathname();
  const segments = path.split("/").filter(Boolean);
  // Default to "result" tab
  const { exercise, algoExercise, testCases, persistTestCases, activeTestcaseTab } = useAppSelector(state => state.exercises);
  // const [activeTab, setActiveTab] = useState(Object.entries(testCases)[0][1][0] != undefined ? Object.entries(testCases)[0][1][0]._id  "");

  const isObjectEmpty = (obj: object) => Object.keys(obj).length === 0;

  // Use `algoExercise` if `exercise` is empty
  const currentExercise = isObjectEmpty(exercise) ? algoExercise : exercise;
  // useEffect(() => {
  //   dispatch(setActiveTestcaseTab(Object.entries(testCases)[0][1][0] != undefined ? Object.entries(testCases)[0][1][0]._id : ""));

  // }, [testCases]);

  useEffect(() => {
    if (testCases && Object.entries(testCases).length > 0) {
      const key = currentExercise?.title || createSlug(segments[segments.length - 1]);
      console.log("key", key);
      console.log("testCases", testCases);
      const currentTestCases = testCases[key] || [];
      console.log("currentTestCases", currentTestCases);
      if (currentTestCases.length > 0 || !activeTestcaseTab) {
        dispatch(setActiveTestcaseTab(currentTestCases[0]._id));
      }
    }
  }, []);


  const handleAddTab = () => {
    const key = currentExercise?.title || createSlug(segments[segments.length - 1]); // Use currentExercise title or fallback to URL slug
    const currentTestCases = testCases[key] || []; // Get existing test cases for the key

    const newTestCase: ITestCase = {
      _id: crypto.randomUUID(),
      input: currentExercise.testcases ? currentExercise.testcases[0].input : [], // Provide default or fallback values

    };

    dispatch(
      addTestCase({
        key,
        testCase: newTestCase,
      })
    );
  };



  const handleCloseTab = (key: string, id: string) => {
    const currentTestCases = testCases[key] || [];

    dispatch(removeTestCase({ key, testCaseId: id }));

    // Check if the active tab is being closed
    if (activeTestcaseTab === id) {
      // Set a new active tab if there are remaining test cases
      const remainingTestCases = currentTestCases.filter(testCase => testCase._id !== id);
      if (remainingTestCases.length > 0) {
        dispatch(setActiveTestcaseTab(remainingTestCases[0]._id)); // Switch to the first remaining tab
      } else {
        dispatch(setActiveTestcaseTab("result")); // Switch to the result tab if there are no remaining tabs
      }
    }
  };

  const handleChangeInput = (key: string, id: string, inputKey: string, value: string) => {
    dispatch(handleChangeInputTestCase({ key, id, inputKey, value }));
  };

  return (
    <Tabs
      defaultValue={activeTestcaseTab || Object.entries(testCases)[0][1][0]._id}
      value={activeTestcaseTab}
      onValueChange={(value) => {
        dispatch(setActiveTestcaseTab(value));
      }}
      className="w-full flex flex-col h-full pt-2"
    >
      <header className="flex items-center px-4 bg-transparent ">
        <TabsList className="bg-transparent">
          {testCases && Object.entries(testCases).length > 0 ? (
            Object.entries(testCases).map(([key, testCaseGroup]) => (
              // Replace the key with a dynamic key if needed 

              <div key={key} className="flex flex-wrap gap-4 bg-transparent justify-start pb-4">
                {createSlug(key) === segments[segments.length - 1] && (
                  <> {testCaseGroup.map((tab, i) => (
                    <div key={tab._id} className="relative group">
                      <TabsTrigger
                        value={tab._id}
                        className="!hover:bg-gray-200">
                        {`Case ${i + 1}`}
                        {true && (
                          <div
                            className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent tab switch when closing
                              handleCloseTab(key, tab._id); // Pass the group key along with the tab ID
                            }}
                          >
                            <IoIosCloseCircle />
                          </div>
                        )}
                      </TabsTrigger>
                    </div>
                  ))}
                    <button
                      onClick={handleAddTab}
                      className="px-4 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                      +
                    </button></>
                )}


              </div>
            ))
          ) : (
            <div>loading</div>
          )}


        </TabsList>
      </header>

      {testCases && Object.entries(testCases).length > 0 ? (
        Object.entries(testCases).map(([groupKey, testCaseGroup]) => (
          <div key={groupKey}>
            {createSlug(groupKey) === segments[segments.length - 1] && (<>
              {testCaseGroup.map((tab, index) => (
                <TabsContent key={tab._id} value={tab._id} className="flex-1">
                  <div className="bg-white w-full text-gray-800 p-4 flex flex-col gap-4">
                    {tab.input.map((obj, index) => {
                      const key = Object.keys(obj)[0];
                      const value = obj[key];
                      return (
                        <div key={index}>
                          <div>{key} =</div>
                          <Textarea
                            value={value}
                            className="w-full p-3 rounded-xl bg-[#000a200d] outline-none !min-h-[80px]"
                            onChange={(e) => handleChangeInput(groupKey, tab._id, key, e.target.value)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
              ))}
            </>)}

          </div>
        ))
      ) : (
        <div>loading</div>
      )}

    </Tabs>
  );
}
