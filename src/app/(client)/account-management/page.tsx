"use client";
import AccountSignInForm from "@/components/account-management/account-sign-in-form";
import ConnectedProvider from "@/components/account-management/connected-provider";
import PersonalInfoForm from "@/components/account-management/personal-info-form";
import { Algorithm, C } from "@/components/mastery";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BsHexagonFill, BsPersonVcardFill } from "react-icons/bs";
import { MdVpnKey } from "react-icons/md";
import { z } from "zod";

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
                                <BsHexagonFill
                                    size={20}
                                    className="group-hover:text-pink_primary transition-colors"
                                />
                                MASTERY
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

                    <div className="grid lg:grid-cols-7 lg:grid-rows-none grid-rows-3 h-fit ">
                        <div className="lg:col-span-3 row-span-1 bg-[#EBEBF3] rounded-s-sm">
                            <div className="mx-10 my-8 space-y-4">
                                <div className="text-2xl font-semibold whitespace-nowrap">Mastery</div>
                                <div className="text-sm">
                                    You earn Mastery Points for whatever part you did every time you complete
                                    exercise
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-4  row-span-2 lg:row-span-1 bg-white relative rounded-e-sm">
                            <div className="flex gap-4 mx-10 my-8  items-center">
                                <div className="size-20">
                                    <C.TierFive />
                                </div>

                                <div className="size-20">
                                    <Algorithm.TierOne />
                                </div>
                            </div>
                        </div>
                    </div>
                    <AccountSignInForm />
                    <ConnectedProvider/>
                </div>
            </div>
        </div>
    );
}
