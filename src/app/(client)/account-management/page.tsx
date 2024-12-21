'use client'
import AccountSignInForm from "@/components/account-management/account-sign-in-form";
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
const personalInfoFormSchema = z.object({
    email: z.string().email({ message: "Invalid email" }),
    name: z.string().min(1, { message: "Required" }),
});

const accountSignInFormSchema = z.object({
    username: z.string().min(1, { message: "Required" }),
    "current-password": z.string().min(1, { message: "Required" }),
    "new-password": z.string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    "confirm-password": z.string().min(1, { message: "Required" }),
}).refine(data => data["new-password"] === data["confirm-password"], {
    path: ["confirm-password"], // path of error
    message: "Passwords do not match",
});


export default function AccountManagementPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const defaultValuesPersonalInfo = {
        email: "m@gmail.com",
        name: "devarena192302",
    };

    const defaultValuesAccountSignIn = {
        username: "",
        "current-password": "",
        "new-password": "",
        "confirm-password": "",
    }

    const personalInfoForm = useForm<z.infer<typeof personalInfoFormSchema>>({
        resolver: zodResolver(personalInfoFormSchema),
        defaultValues: defaultValuesPersonalInfo,
    });

    const accountSignInForm = useForm<z.infer<typeof accountSignInFormSchema>>({
        resolver: zodResolver(accountSignInFormSchema),
        defaultValues: defaultValuesAccountSignIn,
    });

    const watchFields = personalInfoForm.watch();
    const hasChanged = Object.keys(defaultValuesPersonalInfo).some(
        key => watchFields[key as keyof typeof defaultValuesPersonalInfo] !== defaultValuesPersonalInfo[key as keyof typeof defaultValuesPersonalInfo]
    );

    const watchFieldsAccountSignIn = accountSignInForm.watch();
    const hasChangedAccountSignIn = Object.keys(defaultValuesAccountSignIn).some(
        key => watchFieldsAccountSignIn[key as keyof typeof defaultValuesAccountSignIn] !== defaultValuesAccountSignIn[key as keyof typeof defaultValuesAccountSignIn]
    );

    function personalInfoOnSubmit(data: z.infer<typeof personalInfoFormSchema>) {
        console.log(data);
    }

    function accountSignInOnSubmit(data: z.infer<typeof accountSignInFormSchema>) {
        console.log(data);
    }

    return (
        <div className="w-full max-w-4xl lg:max-w-7xl mx-auto py-10 ">
            <div className="grid lg:grid-cols-4 grid-cols-1 gap-4 ">
                <div className="lg:col-span-1">
                    <div className="fixed top-28 space-y-10">
                        <div className="xl:text-4xl text-3xl font-semibold">
                            Account <br /> Management
                        </div>
                        <div className="space-y-3 text-sm font-semibold">
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

                    <div className="grid grid-cols-7 h-fit ">
                        <div className="col-span-3 bg-[#EBEBF3] rounded-s-sm" >
                            <div className="mx-10 my-8 space-y-4">
                                <div className="text-2xl font-semibold whitespace-nowrap">
                                    Mastery
                                </div>
                                <div className="text-sm">
                                    You earn Mastery Points for whatever part you did every time you complete exercise
                                </div>
                            </div>
                        </div>
                        <div className="col-span-4 bg-white relative rounded-e-sm" >
                            <div className="flex gap-4 mx-10 my-8  items-center" >
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


                </div>
            </div>

        </div>
    );
}
