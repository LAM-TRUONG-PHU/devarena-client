import { mainInstance } from "@/axios/MainInstance";
import { Input } from "@/components/ui/input";
import { usePrivate } from "@/hooks/usePrivateAxios";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { FaDiscord, FaGithub, FaPlus } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
const ProviderList = [
  {
    icon: <FcGoogle className="w-6 h-6 " />,
    provider: "Google",
    css: " bg-white",
  },
  {
    icon: <FaDiscord className="w-6 h-6 " />,
    provider: "Discord",
    css: "bg-blue_facebook text-white ",
  },
  {
    icon: <FaGithub className="w-6 h-6 " />,
    provider: "Github",
    css: "bg-gray-800 text-white",
  },
];
export default function ConnectedProvider() {
  const { data: session } = useSession();
  const param = useParams();
  useEffect(() => {
    console.log(session);
  }, []);
  const addProvider = async (provider: string) => {
    // await axios
    //   .get(`http://localhost:3001/api/auth/provider/${provider}`)
    //   .then((e) => {
    //     console.log(e);
    //   });
    window.location.href = "http://localhost:3001/api/auth/provider/google";

  };
  return (
    <div className="grid lg:grid-cols-7 lg:grid-rows-none grid-rows-3 h-fit ">
      <div className="lg:col-span-3 row-span-1 bg-[#EBEBF3] rounded-s-sm">
        <div className="mx-10 my-8 lg:space-y-4">
          <div className="text-2xl font-semibold xl:whitespace-nowrap">
            Connected Accounts
          </div>
          <div className="text-sm">
            If connected, these accounts can access some of the data that you
            provide to DevArena.
          </div>
        </div>
      </div>
      <div className="lg:col-span-4  row-span-2 lg:row-span-1 bg-white relative rounded-e-sm flex flex-col ml-6">
        <span>Connected</span>
        <div></div>
        <span>Your social sign-in</span>
        <div className="flex flex-col w-[50%] gap-4">
          {ProviderList.map((e, i) => {
            if (
              session?.user.providers.includes(e.provider.toLocaleLowerCase())
            ) {
              return null;
            } else {
              return (
                <>
                  <button
                    type="button"
                    className={`flex-1 ${e.css} px-4 py-2 rounded-xl shadow  flex gap-4 justify-between`}
                    onClick={() => {
                      addProvider(e.provider);
                      //   onSubmitProvider("google");
                    }}
                  >
                    {e.icon} {e.provider} <FaPlus className="w-6 h-6 " />
                  </button>
                </>
              );
            }
          })}
          {/* <button
            type="button"
            className="flex-1 bg-blue_facebook text-white  px-4 py-2 rounded-xl shadow hover:bg-blue-700  flex gap-4 justify-between"
            onClick={(e) => {
            //   onSubmitProvider("discord");
            }}
          >
            <FaDiscord className="w-6 h-6 " /> Discord <FaPlus className="w-6 h-6 " />
          </button>
          <button
            type="button" 
            className="flex-1 bg-white border-2 border-black  px-4 py-1 rounded-xl  hover:bg-gray-100  flex gap-4 justify-between "
            onClick={(e) => {
            //   onSubmitProvider("google");
            }}
          >
            <FcGoogle className="w-6 h-6 " /> Google <FaPlus className="w-6 h-6 " />
          </button>
          <button
            type="button"
            className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-xl shadow hover:bg-gray-900 flex gap-4 justify-between"
            onClick={(e) => {
            //   onSubmitProvider("github");
            }}
          >
            <FaGithub className="w-6 h-6 " /> Github <FaPlus className="w-6 h-6 " />
          </button> */}
        </div>
      </div>
    </div>
  );
}
