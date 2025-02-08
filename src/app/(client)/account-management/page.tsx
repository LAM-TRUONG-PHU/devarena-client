"use client";
import AccountSignInForm from "@/components/account-management/account-sign-in-form";
import PersonalInfoForm from "@/components/account-management/personal-info-form";
import { Algorithm, C } from "@/components/mastery";

import { BsHexagonFill, BsPersonVcardFill } from "react-icons/bs";
import { MdVpnKey } from "react-icons/md";

export default function AccountManagementPage() {

    return (
        <div className="w-full max-w-sm xl:max-w-7xl mx-auto py-10 ">
            <div className="grid lg:grid-cols-4 grid-cols-1 gap-4 ">
                <div className="lg:col-span-1">
                    <div className="lg:fixed lg:top-28 lg:space-y-10">
                        <div className="xl:text-4xl text-3xl font-semibold text-center lg:text-start">
                            Account <br className="hidden lg:block" /> Management
                        </div>
                        <div className="space-y-3 text-xs xl:text-sm font-semibold hidden lg:block">
                            <div className="flex items-center gap-4 group cursor-pointer">
                                <BsPersonVcardFill
                                    size={20}
                                    className="group-hover:text-pink_primary transition-colors"
                                />
                                PERSONAL INFORMATION
                            </div>
                            <div className="flex items-center gap-4 group cursor-pointer">
                                <MdVpnKey
                                    size={20}
                                    className="group-hover:text-pink_primary transition-colors"
                                />
                                DEVARENA ACCOUNT SIGN-IN
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-3  space-y-8">
                    <PersonalInfoForm />

                    <AccountSignInForm />
                    {/* <ConnectedProvider/> */}
                </div>
            </div>
        </div>
    );
}
