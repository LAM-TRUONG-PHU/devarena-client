import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardPen } from "lucide-react";
import { IoIosCloseCircle } from "react-icons/io";
import { useAppSelector } from "@/redux/hooks";

export function TabsTestCase() {
    const {exerciseSelected}=useAppSelector((state)=>state.exerciseStatus)
  const [tabs, setTabs] = useState([
    {
      id: "1",
      name: "Case 1",
      content: "Content for Case 1",
      removable: false,
    },
    {
      id: "2",
      name: "Case 2",
      content: "Content for Case 2",
      removable: false,
    },
    {
      id: "3",
      name: "Case 3",
      content: "Content for Case 3",
      removable: false,
    },
  ]);
  const [activeTab, setActiveTab] = useState("1");

  const handleAddTab = () => {
    const newId = (tabs.length + 1).toString();
    setTabs([
      ...tabs,
      {
        id: newId,
        name: `Case ${newId}`,
        content: `Content for Case ${newId}`,
        removable: true,
      },
    ]);
    setActiveTab(newId);
  };

  const handleCloseTab = (id: string) => {
    setTabs((prevTabs) => {
      const updatedTabs = prevTabs
        .filter((tab) => tab.id !== id)
        .map((tab, index) => ({
          ...tab,
          id: (index + 1).toString(),
          name: `Case ${index + 1}`,
        }));
      if (updatedTabs.length > 0 && id === activeTab) {
        setActiveTab(updatedTabs[0].id); // Switch to the first tab if the active tab is closed
      }
      return updatedTabs;
    });
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
          {tabs.map((tab) => (
            <div key={tab.id} className="relative group">
              <TabsTrigger value={tab.id} className="relative">
                {tab.name}
                {tab.removable && (
                  <div
                    className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent tab switch when closing
                      handleCloseTab(tab.id);
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
          </button>
        </TabsList>
      </header>

      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="flex-1">
          <div className="bg-white w-full text-gray-800 p-4 flex flex-col gap-4">
            {/* {exerciseSelected?.exerciseId.input..map((input)=>{
                return <div>
                    <div>{input.name} =</div>
                    <input type="text" className="w-full p-3 rounded-xl bg-[#000a200d] outline-none" />
                </div>
            })} */}
            {/* <div>
              <div>A =</div>
              <input type="text" className="w-full p-3 rounded-xl bg-[#000a200d] outline-none" />
            </div>
            <div>
              <div>B =</div>
              <input type="text" className="w-full p-3 rounded-xl bg-[#000a200d] outline-none" />
            </div> */}
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
