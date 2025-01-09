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
  setTestCases,
} from "@/redux/slices/admin/exerciseStudySlice";
import { Spinner } from "../ui/spinner";
import { usePathname } from "next/navigation";
import { createSlug } from "@/lib/helper";
import { create } from "domain";

export function TabsTestCase() {
  const dispatch = useAppDispatch();
  // const { testCases, exerciseSelected } = useAppSelector(
  //   (state) => state.exerciseStatus
  // );
  const path = usePathname();
  const segments = path.split("/").filter(Boolean);
  const [activeTab, setActiveTab] = useState("1");
  const { exercise, testCases, persistTestCases } = useAppSelector(state => state.exercises)


  useEffect(() => {
    // Only run if testCases is empty 
    if (!testCases[exercise.title] || testCases[exercise.title].length === 0) {
      if (persistTestCases[exercise.title]) {
        dispatch(setTestCases({ key: exercise.title, testCases: persistTestCases[exercise.title] }))
      }
      else if (exercise.testcases) {

        dispatch(
          setTestCases({
            key: exercise.title,
            testCases: exercise.testcases.map((testcase, index) => {
              return {
                _id: (index + 1).toString(),
                input: testcase.input,
              };
            }
            ),
          })
        );
      }

    }
  }, [testCases, exercise.testcases, dispatch, persistTestCases,]);

  useEffect(() => {
    console.log(testCases)
  }, [testCases]);

  const handleAddTab = () => {
    const key = exercise.title; // Replace with a dynamic key if needed
    const currentTestCases = testCases[key] || []; // Get existing test cases for the key

    const newId = (currentTestCases.length + 1).toString();
    const newTestCase: ITestCase = {
      _id: newId,
      input: exercise.testcases ? exercise.testcases[0].input : [], // Provide default or fallback values

    };

    dispatch(
      addTestCase({
        _id: newId,
        input: exerciseSelected?.exerciseId.testcases![0].input!,
        output: exerciseSelected?.exerciseId.testcases![0].output!,
        status: false,
        statusCompile: StatusCompile.COMPILE_WAITING,
        outputExpected: "10"
      })
    );
  };


  const handleCloseTab = (key: string, id: string) => {
    const currentTestCases = testCases[key] || [];

    dispatch(removeTestCase({ key, testCaseId: id }));

    // Check if the active tab is being closed
    if (activeTab === id) {
      // Set a new active tab if there are remaining test cases
      const remainingTestCases = currentTestCases.filter(testCase => testCase._id !== id);
      if (remainingTestCases.length > 0) {
        setActiveTab(remainingTestCases[0]._id); // Switch to the first remaining tab
      } else {
        setActiveTab("result"); // Switch to the result tab if there are no remaining tabs
      }
    }
  };

  const handleChangeInput = (key: string, id: string, inputKey: string, value: string) => {
    dispatch(handleChangeInputTestCase({ key, id, inputKey, value }));
  };
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
    <Tabs
      defaultValue={activeTab}
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full flex flex-col h-full pt-2 "
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
                        className="!hover:bg-gray-200"

                      >

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
                      const key = Object.keys(obj)[0]; // Extract key from object
                      const value = obj[key]; // Extract value
                      return (
                        <div key={index}>
                          <div>{key} =</div>
                          <input
                            type="text"
                            value={value} // Display initial value
                            className="w-full p-3 rounded-xl bg-[#000a200d] outline-none"
                            onChange={(e) => handleChangeInput(groupKey, tab._id, key, e.target.value)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
              ))}</>)}

          </div>
        ))
      ) : (
        <div>loading</div>
      )}

    </Tabs>
  );
}
