import React from "react";
import { BsPersonVcardFill } from "react-icons/bs";
import { MdVpnKey } from "react-icons/md";
import { BsHexagonFill } from "react-icons/bs";

export default function AccountManagementPage() {
    return (
        <div className="w-full max-w-4xl lg:max-w-6xl mx-auto py-10">
            <div className="grid lg:grid-cols-4 grid-cols-1 gap-4 relative">
                <div className="lg:col-span-1">
                    <div className="fixed top-28 space-y-10">
                        <div className="xl:text-4xl text-3xl ">
                            Account <br /> Management
                        </div>
                        <div className="space-y-3 text-sm font-semibold">
                            <div className="flex items-center gap-4 group cursor-pointer">
                                <BsPersonVcardFill
                                    size={20}
                                    className="group-hover:text-pink_primary transition-colors "
                                />
                                PERSONAL INFORMATION
                            </div>
                            <div className="flex items-center gap-4 group cursor-pointer">
                                <BsHexagonFill
                                    size={20}
                                    className="group-hover:text-pink_primary transition-colors "
                                />
                                MASTERY
                            </div>
                            <div className="flex items-center gap-4 group cursor-pointer">
                                <MdVpnKey
                                    size={20}
                                    className="group-hover:text-pink_primary transition-colors "
                                />
                                DEVARENA ACCOUNT SIGN-IN
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-3 bg-pink-400 h-screen">
                    <div className="grid grid-cols-7 h-fit py-10">
                        <div className="col-span-3 bg-[#EBEBF3]">
                            <div className="px-10 py-8 space-y-4">
                                <div className="text-3xl font-semibold text-center whitespace-nowrap">
                                    Personal Information
                                </div>
                                <div className="text-sm ">
                                    This information is public and will be shared with other users.
                                </div>
                            </div>
                        </div>
                        <div className="col-span-4 bg-white "></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
