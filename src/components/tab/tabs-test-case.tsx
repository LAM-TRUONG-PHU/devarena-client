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
} from "@/redux/slices/ExerciseStatusSlice";
import { Spinner } from "../ui/spinner";

export function TabsTestCase() {
  const dispatch = useAppDispatch();
  const { testCases, exerciseSelected } = useAppSelector(
    (state) => state.exerciseStatus
  );
  const [activeTab, setActiveTab] = useState("1");
  // const [tabs, setTabs] = useState<ITestCase[]>(exerciseSelected?.exerciseId.testcases||[]);

  const handleAddTab = () => {
    const newId = (testCases.length + 1).toString();
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
    setActiveTab(newId);
  };

  const handleCloseTab = (id: string) => {
    dispatch(removeTestCase(id));
    if (testCases!.length > 0 && id === activeTab) {
      setActiveTab(testCases![0]._id); // Switch to the first tab if the active tab is closed
    }
  };
  const handleChangeInput = (id: string, key: string, value: string) => {
    dispatch(handleChangeInputTestCase({ id, key, value: value.toString() }));
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
      <header className="flex items-center px-4 bg-transparent relative">
        <TabsList className="flex flex-wrap gap-4 bg-transparent justify-start pb-4">
          {testCases ? (
            testCases!.map((tab, i) => (
              <div key={tab._id} className="relative group">
                <TabsTrigger
                  value={tab._id}
                  className={`relative ${
                    tab.statusCompile === StatusCompile.COMPILE_SUCCESS
                      ? "bg-green-500"
                      : tab.statusCompile === StatusCompile.COMPILE_FAILED
                      ? "bg-red-500"
                      : tab.statusCompile === StatusCompile.COMPILE_RUNNING
                      ? "bg-yellow-500"
                      : ""
                  }`}
                >
                  {renderStatusIcon(tab.statusCompile)}

                  {`
                  Case ${i + 1}`}
                  {true && (
                    <div
                      className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent tab switch when closing
                        handleCloseTab(tab._id);
                      }}
                    >
                      <IoIosCloseCircle />
                    </div>
                  )}
                </TabsTrigger>
              </div>
            ))
          ) : (
            <div>loading</div>
          )}

          <button
            onClick={handleAddTab}
            className="px-4 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            +
          </button>
        </TabsList>
      </header>

      {testCases!.map((tab, index) => (
        <TabsContent key={tab._id} value={tab._id} className="flex-1">
          <div className="bg-white w-full text-gray-800 p-4 flex flex-col gap-4">
            {tab.input.map((obj, index) => {
              const key = Object.keys(obj)[0]; // Lấy key từ object
              const value = obj[key]; // Lấy value tương ứng
              return (
                <div key={index}>
                  <div>{key} =</div>
                  <input
                    type="text"
                    value={value} // Hiển thị giá trị ban đầu
                    className="w-full p-3 rounded-xl bg-[#000a200d] outline-none"
                    onChange={(e) =>
                      handleChangeInput(tab._id, key, e.target.value)
                    }
                  />
                </div>
              );
            })}

            {/* <div>
              <div>A =</div>
              <input type="text" className="w-full p-3 rounded-xl bg-[#000a200d] outline-none" />
            </div>
            <div>
              <div>B =</div>
              <input type="text" className="w-full p-3 rounded-xl bg-[#000a200d] outline-none" />
            </div> */}
            {tab.statusCompile === StatusCompile.COMPILE_SUCCESS ||
            tab.statusCompile === StatusCompile.COMPILE_FAILED ? (
              <>
                <div>
                  <div>Output = </div>
                  <input
                    type="text"
                    className={`w-full p-3 rounded-xl outline-none ${
                      tab.statusCompile === StatusCompile.COMPILE_SUCCESS
                        ? "bg-green-200 text-green-600"
                        : "bg-red-200 text-red-600"
                    }`}
                    value={tab.output}
                    disabled
                  />
                </div>
                <div>
                  <div>Expected Output = </div>
                  <input
                    type="text"
                    value={tab.outputExpected}
                  
                    className={`w-full p-3 rounded-xl outline-none ${
                      tab.statusCompile === StatusCompile.COMPILE_SUCCESS
                        ? "bg-green-200 text-green-600"
                        : "bg-red-200 text-red-600"
                    }`}
                    disabled
                  />
                </div>
              </>
            ) : null}
          </div>
        </TabsContent>
      ))}

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
