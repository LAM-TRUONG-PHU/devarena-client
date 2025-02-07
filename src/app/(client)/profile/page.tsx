"use client";
import Difficulty from "@/components/difficulty";
import { _PieChart } from "@/components/profile/pie-chart";
import { EDifficulty } from "@/components/sort";
import { Button } from "@/components/ui/button";
import { avatarDefault } from "@/types/constants";
import { User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function ProfilePage() {
  // const [currentAvatar, setCurrentAvatar] = useState<string>("/avatar.jpg");
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <div className="w-full max-w-4xl xl:max-w-7xl mx-auto py-10 ">
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-8">
        <div className="lg:col-span-1 h-screen">
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
              <div className="font-medium">Languages</div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="tag px-4">Java</div>
                  <div className="text-xs">
                    <b>2</b> algorithms solved
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="tag px-4">C</div>
                  <div className="text-xs">
                    <b>1</b> algorithm solved
                  </div>
                </div>
              </div>
            </div>
            <div className="card-bg hover:scale-100 space-y-4">
              <div className="font-medium">Skills</div>
              <div className="text-sm flex flex-wrap gap-4">
                <div className="flex gap-1 items-center">
                  <div className="tag px-4">Function</div>
                  <div>x2</div>
                </div>
                <div className="flex gap-1 items-center">
                  <div className="tag px-4">Function</div>
                  <div>x2</div>
                </div>
                <div className="flex gap-1 items-center">
                  <div className="tag px-4">Function</div>
                  <div>x2</div>
                </div>
                <div className="flex gap-1 items-center">
                  <div className="tag px-4">Function</div>
                  <div>x2</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 h-screen">
          <div className="flex gap-8">
            <div className="flex-1">
              <div className="card-bg hover:scale-100 h-52">
                <div className="flex gap-4">
                  <div className="space-y-2">
                    <Difficulty variant={EDifficulty.Easy} isProfile />
                    <Difficulty variant={EDifficulty.Medium} isProfile />
                    <Difficulty variant={EDifficulty.Hard} isProfile />
                  </div>
                  <_PieChart />
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="card-bg hover:scale-100 h-52">
                <div className="flex gap-4">
                  <div className="space-y-2">
                    <Difficulty variant={EDifficulty.Easy} isProfile />
                    <Difficulty variant={EDifficulty.Medium} isProfile />
                    <Difficulty variant={EDifficulty.Hard} isProfile />
                  </div>
                  <_PieChart />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
