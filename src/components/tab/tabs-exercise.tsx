import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MdOutlineTask } from "react-icons/md";
import { ChevronsUpDown, ClipboardList, ClipboardPen } from "lucide-react";
import { GoTerminal } from "react-icons/go";
import { TabsTestCase } from "./tabs-test-case";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { JSX, Suspense, use, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import { usePathname, useSearchParams } from "next/navigation";
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
import { IExercise, StatusCompile } from "@/types/Exercise";
import { usePrivate } from "@/hooks/usePrivateAxios";
import { setCompile, setLoading, setSubList, setSubmission } from "@/redux/slices/admin/exerciseStudySlice";
import { Skeleton } from "../ui/skeleton";
import { Label } from "../ui/label";
import { useSession } from "next-auth/react";
import { avatarDefault } from "@/types/constants";
import { getLanguageValue } from "@/utils/get-language-value";



export function TabsExercise() {
  const {
    exercise,
    algoExercise,
    loading,
    testCases,
    loadingTestCase,
    loadingSubList,
    compile,
    code,
    codeAlgo,
    resultSubmit,
    subList,
    clickTracker,
    submissionId,
    language,
    submission, testCasesResult
  } = useAppSelector((state) => state.exercises);
  // Function to check if an object is empty
  const isObjectEmpty = (obj: object) => Object.keys(obj).length === 0;

  // Use `algoExercise` if `exercise` is empty
  const currentExercise = isObjectEmpty(exercise) ? algoExercise : exercise;
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const isExerciseLoaded = currentExercise && currentExercise.testcases && currentExercise.testcases[0]?.input.length > 0;
  const carouselRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const dispatch = useAppDispatch();
  const axiosPrivate = usePrivate();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("task");
  const [activeSolutionTab, setActiveSolutionTab] = useState("java");
  const { data: session } = useSession()


  useEffect(() => { console.log("currentExercise", currentExercise) }, [currentExercise]);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    // Use Intl.DateTimeFormat to format the date
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "short",  // Abbreviated month (e.g., "Jan")
      day: "2-digit",  // Two-digit day
      year: "numeric", // Full year (e.g., "2025")
      hour: "2-digit", // Two-digit hour
      minute: "2-digit", // Two-digit minute
      hour12: false,    // 24-hour clock
    }).format(date);

    return formattedDate;
  };


  useEffect(() => {
    if (compile == "Test Result" && activeTab !== "result") {
      setActiveTab("result");
    } else if (
      (compile == "Accepted" || compile == "Compile Error" || compile == "Wrong Answer") &&
      activeTab !== "compile"
    ) {
      setActiveTab("compile");
    }
  }, [compile, clickTracker]);


  useEffect(() => {
    if (!submissionId) return;
    axiosPrivate
      .get(`/exercise-status/exercise/${searchParams.get("id")!}/submission/${submissionId}`)
      .then((res) => {
        dispatch(setSubmission(res.data.data || {}));
        dispatch(setLoading(false));
      })
      .catch((err) => {
        console.error(err);
      });
  }, [submissionId, clickTracker]);

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
    <Suspense>
      <Tabs
        defaultValue="task"
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value);
          dispatch(setCompile(null));
        }}
        className="w-full flex flex-col h-full relative"
      >
        <header className="flex sticky top-0  items-center border-foreground border-b-[0.5px] bg-white z-20">
          <TabsList className="w-full max-w-lg  3xl:max-w-lg  mx-auto h-12 flex items-center ">
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
                {
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
              __html: currentExercise.content!,
            }} className="max-h-[80vh] overflow-auto"
          ></div>
        </TabsContent>
        <TabsContent value="instruction" className="flex-1 overflow-auto">
          <div className="max-h-[82vh] overflow-auto">
            {"solution" in currentExercise ? (
              <PrismCode code={currentExercise?.solution ?? ""} language={segments[1]} />
            ) : "solutions" in currentExercise ? (

              <>
                <Tabs value={activeSolutionTab} onValueChange={setActiveSolutionTab} className="w-full">
                  <TabsList className="flex gap-4">
                    {currentExercise.solutions?.map((solution, index) => {
                      return (
                        <TabsTrigger value={solution.language} key={index}>
                          {solution.language}
                        </TabsTrigger>
                      );
                    })}

                  </TabsList>
                  <div>
                    {currentExercise.solutions?.map((solution) => {
                      return (
                        <TabsContent key={solution.language} value={solution.language} className="p-4">
                          <PrismCode code={solution.code} language={solution.language} />
                        </TabsContent>
                      );
                    })}
                  </div>
                </Tabs>


                {/* {currentExercise.solutions?.map((solution, index) => (
                <PrismCode key={index} code={solution.code} language={solution.language} />
              ))} */}
              </>

            ) : null}
          </div>
        </TabsContent>

        {
          <TabsContent value="test-case" className="flex-1">
            <TabsTestCase />
          </TabsContent>
        }


        <TabsContent value="result" className="mt-4 ">


          {testCasesResult?.[currentExercise.title!]?.length ? (
            testCasesResult[currentExercise.title!][0].hasOwnProperty("output") ? (
              <div className="max-h-[82vh] overflow-auto">
                <TabsResult />
              </div>
            ) : loadingTestCase ? (
              <div className="flex flex-col space-y-3  px-4 ">
                <header className="flex items-center bg-transparent ">
                  <div
                    className="flex flex-wrap gap-4 bg-transparent justify-start pb-4"

                  >
                    <Skeleton className="flex items-center w-32 h-8 justify-center whitespace-nowrap rounded-xl px-3 py-1  font-medium ring-offset-background" />
                    <Skeleton className="flex items-center w-32 h-8 justify-center whitespace-nowrap rounded-xl px-3 py-1  font-medium ring-offset-background" />
                    <Skeleton className="flex items-center w-32 h-8 justify-center whitespace-nowrap rounded-xl px-3 py-1  font-medium ring-offset-background" />


                  </div>

                </header>
                <div className="space-y-2 ">
                  <Skeleton className="h-44 w-full rounded-xl" />
                </div>
                <div className="space-y-2 ">
                  <Skeleton className="h-44 w-full rounded-xl" />
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="flex justify-center my-4">
                  <ClipboardPen size={60} />
                </div>
                <div className="font-semibold text-lg">Run tests to check your code</div>
                <p>
                  Run your code against tests to verify its correctness, <br />
                  and view the results here.
                </p>
              </div>
            )
          ) : (
            <div className="text-center">
              <div className="flex justify-center my-4">
                <ClipboardPen size={60} />
              </div>
              <div className="font-semibold text-lg">Run tests to check your code</div>
              <p>
                Run your code against tests to verify its correctness, <br />
                and view the results here.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="submission" className="flex-1">
          <div className="max-h-[80vh] overflow-auto">
            <TabSubmission />
          </div>
        </TabsContent>
        <TabsContent value="compile" className="flex-1 p-4 bg-white space-y-2">
          <div className="max-h-[80vh] overflow-auto">
            <div className="space-y-2">
              {loading ? (<LoadingSpinner />) : (<>
                <div className="flex items-center space-x-1">
                  <div
                    className={`${compile == "Accepted" ? "text-green_primary" : "text-red_primary"
                      } font-semibold text-lg`}
                  >
                    {compile}
                  </div>
                  {(compile == "Accepted" || compile == "Wrong Answer") && (
                    <div className="text-sm ">{"result" in submission ? submission.result : resultSubmit.result} testcases passed</div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={session?.user.avatar ?? avatarDefault} alt={""} className="rounded-full object-cover" />
                    <AvatarFallback> {"Avatar"}</AvatarFallback>
                  </Avatar>

                  <div className="text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{session?.user.username} </span>
                    submitted at {'createdAt' in submission ? formatDate(submission.createdAt) : resultSubmit?.submittedAt}
                  </div>
                </div>
                <div className="p-4 !bg-gray-100 !rounded-xl">
                  {compile == "Accepted" ? (
                    <div>
                      <div className="flex gap-1 items-center">
                        <FaRegClock />
                        <div>Runtime</div>
                      </div>
                      <div className="flex items-center">
                        <div>
                          <span className="font-semibold text-lg">
                            {
                              Number(('totalTime' in submission ? submission.totalTime : resultSubmit?.totalRuntime!) / 1000).toFixed(2)}
                          </span>{" "}
                          s{" "}
                        </div>
                        <Separator orientation="vertical" className="mx-2 h-6" />
                        <div>
                          Beats
                          <span className="font-semibold text-lg">
                            {" "}{Number("compareTime" in submission ? submission.compareTime : resultSubmit?.compareTime).toFixed(2)}
                          </span>{" "}
                          %
                        </div>
                      </div>
                      <ChartRuntime />
                    </div>
                  ) : compile == "Wrong Answer" ? (
                    <>
                      <div className="font-semibold text-lg">Output</div>

                      <div
                        className="bg-white w-full text-gray-800 p-4 flex flex-col gap-4"
                      >
                        {"testcase" in submission ? submission.testcase?.input.map((obj, index) => {
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
                        }) :
                          resultSubmit.testcase?.input.map((obj, index) => {
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
                        <div className="grid w-full gap-1.5">
                          <Label htmlFor="message-2">Output</Label>
                          <Textarea
                            title="Output"
                            readOnly
                            className="w-full p-3 rounded-xl"
                            value={"testcase" in submission ? submission.testcase?.output : resultSubmit.testcase?.output}

                          />
                        </div>

                        <div className="grid w-full gap-1.5">
                          <Label htmlFor="message-2">Expected</Label>
                          <Textarea
                            readOnly
                            title="Expected"
                            className="w-full p-3 rounded-xl"
                            value={"testcase" in submission ? submission.testcase?.outputExpected : resultSubmit.testcase?.outputExpected}

                          />
                        </div>

                      </div>


                    </>
                  ) : (
                    <div>
                      <PrismCode code={"errorCode" in submission ? submission.errorCode! : resultSubmit.codeFailed || ""} language={"java"} />
                    </div>
                  )}
                </div></>)}

            </div>

            <div>
              <div className="font-medium">Code | {capitalize(segments[1])}</div>
              {loading ? <Skeleton className="h-40 w-full rounded-xl" />
                : (
                  <div className="">
                    {"solution" in currentExercise ? (
                      <PrismCode code={"code" in submission ? submission.code : code[`${currentExercise.title}`]} language={getLanguageValue(language)} />
                    ) : "solutions" in currentExercise ? (

                      <>
                        <PrismCode code={"code" in submission ? submission.code : codeAlgo[currentExercise.title!]?.find(
                          (entry) => entry.language === getLanguageValue(language)
                        )?.code!} language={getLanguageValue(language)} />


                      </>

                    ) : null}
                  </div>
                )}


              {/* (
              <PrismCode code={"code" in submission ? submission.code : code[`${currentExercise.title}`]} language={"java"} />
              )} */}


            </div>
          </div>

        </TabsContent>
      </Tabs>
    </Suspense>
  );
}
