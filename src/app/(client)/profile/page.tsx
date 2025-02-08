"use client";
import Difficulty from "@/components/difficulty";
import { ChartDifficulty } from "@/components/profile/chart-difficulty";
import { _PieChart } from "@/components/profile/pie-chart";
import { EDifficulty } from "@/components/sort";
import { Button } from "@/components/ui/button";
import { usePrivate } from "@/hooks/usePrivateAxios";
import { avatarDefault } from "@/types/constants";
import { PieChart, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface ITag {
  [key: string]: number;  // The keys are strings, and the values are numbers
}

interface IAchievement {
  title: string;
  requiredScore: number;
  image: string;
}
export default function ProfilePage() {
  // const [currentAvatar, setCurrentAvatar] = useState<string>("/avatar.jpg");
  const router = useRouter();
  const axiosPrivate = usePrivate();
  const { data: session, status } = useSession();
  const [difficulties, setDifficulties] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
  })
  const [tags, setTags] = useState<ITag>({});
  const baseImageURL = `${process.env.NEXT_PUBLIC_BACKEND_UPLOAD_URL}/achievements`;

  const [achievements, setAchievements] = useState<IAchievement[]>(
    []
  );


  useEffect(() => {
    if (status === "authenticated") {

      try {

        axiosPrivate.get("/exercise-status/profile").then(
          (res) => {
            setDifficulties(res.data.data.difficulties);
            setAchievements(res.data.data.achievements);
            setTags(res.data.data.tags);
            console.log(res.data.data);
          }
        )
      } catch (error) {
        console.log(error);
      }
    }

  }, [status]);

  return (
    <div className="w-full max-w-4xl xl:max-w-7xl mx-auto py-10 ">
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-8">
        <div className="lg:col-span-1 ">
          <div className="h-full space-y-8">
            <div className="card-bg hover:scale-100">
              <div className="flex gap-4">
                <div className="h-20 w-20">
                  <img
                    src={session?.user.avatar ?? avatarDefault}
                    alt="Avatar"
                    className="rounded-full h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="text-xl font-semibold whitespace-nowrap">
                      {session?.user.username}
                    </div>
                    <div className="text-sm">{session?.user.email}</div>
                  </div>

                  <Button
                    type="submit"
                    className="border-pink_primary text-pink_primary hover:bg-pink_primary hover:text-white px-0"
                    size="account"
                    variant="outline"
                    onClick={() => router.push("/account-management")}
                  >
                    ACCOUNT MANAGEMENT
                  </Button>
                </div>
              </div>
            </div>
            <div className="card-bg hover:scale-100 space-y-4">
              <div className="font-medium">Skills</div>
              <div className="text-sm flex flex-wrap gap-4">
                {Object.keys(tags).length > 0 ? (
                  Object.keys(tags).map((tag) => (
                    <div key={tag} className="flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-1 rounded-lg shadow-sm">
                      <span className="font-semibold text-blue-600">#{tag}</span>
                      <span className="text-gray-600">×{tags[tag]}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 italic">No tags available.</div>
                )}
              </div>

            </div>
          </div>
        </div>
        <div className="lg:col-span-2 ">
          <div className="flex gap-8">
            <div className="flex-1">
              <div className="card-bg hover:scale-100 h-full space-y-16">
                <div className="flex gap-8">

                  {difficulties && Object.keys(difficulties).map((difficulty, index) => (
                    <> <Difficulty
                      key={difficulty}
                      variant={difficulty as EDifficulty}
                      isProfile
                      value={difficulties[difficulty as keyof typeof difficulties]}
                    />

                    </>

                  ))}
                </div>
                {difficulties.easy == 0 && difficulties.medium == 0 && difficulties.hard == 0 ? (
                  <div className="text-gray-600 text-lg font-semibold p-4 rounded-lg shadow-md">
                    ⚡ No difficulties recorded yet. Keep pushing your limits! 💪
                  </div>
                ) :
                  <ChartDifficulty difficulties={difficulties} />
                }
              </div>
            </div>
            <div className="flex-1">
              <div className="card-bg hover:scale-100 h-full space-y-16">
                <div className="flex gap-8">
                  <div className="grid grid-cols-2 gap-6">
                    {achievements.length > 0 ? (
                      achievements.map((achievement, index) => (
                        <div
                          key={index}
                          className={`col-span-1 flex flex-col items-center bg-gradient-to-br 
          ${achievement.requiredScore == 25
                              ? "from-purple-100 to-blue-100"
                              : achievement.requiredScore == 50
                                ? "from-green-100 to-teal-100"
                                : achievement.requiredScore == 75
                                  ? "from-red-100 to-pink-100"
                                  : achievement.requiredScore == 100
                                    ? "from-yellow-100 to-orange-100"
                                    : achievement.requiredScore == 125
                                      ? "from-orange-100 to-red-100"
                                      : "from-gray-100 to-gray-200"
                            }  
          p-6 rounded-xl shadow-lg border border-gray-300 max-w-xs mx-auto w-full h-full `}
                        >
                          {/* Achievement Image */}
                          <div className="w-20 h-20 mb-4">
                            <img
                              src={`${baseImageURL}/${achievement?.image}`}
                              alt="achievement"
                              className="w-full h-full object-cover rounded-full border-4 border-white shadow-md"
                            />
                          </div>

                          {/* Achievement Details */}
                          <div className="text-center">
                            <h3 className="text-xl font-bold text-gray-800">{achievement.title}</h3>
                            <p className="text-md text-gray-600 mt-1">
                              <span className="font-semibold">{achievement.requiredScore}</span>
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 text-center text-gray-600 text-lg font-semibold p-6  rounded-lg shadow-md">
                        🎉 No achievements yet! Keep going and unlock new milestones! 🚀
                      </div>
                    )}
                  </div>




                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
