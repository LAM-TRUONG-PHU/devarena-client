'use client'
import React, { useState } from "react";
import { BsPersonVcardFill } from "react-icons/bs";
import { MdVpnKey } from "react-icons/md";
import { BsHexagonFill } from "react-icons/bs";
import { IoCameraSharp } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { DialogUpdateAvatar } from "@/components/account-management/dialog-update-avatar";
import { Algorithm, C } from "@/components/mastery";
import { EyeOffIcon, Eye } from "lucide-react";
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
                    <div className="grid grid-cols-7 h-fit ">
                        <div className="col-span-3 bg-[#EBEBF3] rounded-s-sm" >
                            <div className="mx-10 my-8 space-y-4">
                                <div className="text-2xl font-semibold  whitespace-nowrap">
                                    Personal Information
                                </div>
                                <div className="text-sm">
                                    This information is public and will be shared with other users.
                                </div>
                            </div>
                        </div>
                        <div className="col-span-4 bg-white relative rounded-e-sm" >
                            <Form {...personalInfoForm}>
                                <form onSubmit={personalInfoForm.handleSubmit(personalInfoOnSubmit)} className="space-y-4 m-8">


                                    {/* <DialogUpdateAvatar /> */}

                                    <div className="flex-1 space-y-4">
                                        <FormField
                                            control={personalInfoForm.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="Enter your email" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={personalInfoForm.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Name</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="Enter your name" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="grid grid-cols-2 gap-2 !mt-10">
                                            {hasChanged && (
                                                <Button
                                                    type="button"
                                                    className="col-span-1"
                                                    variant="cancel"
                                                    size="account"
                                                    onClick={() => personalInfoForm.reset(defaultValuesPersonalInfo)}
                                                >
                                                    CANCEL
                                                </Button>
                                            )}
                                            <Button
                                                type="submit"
                                                className={`col-span-1 font-semibold  col-start-2 ${!hasChanged ? "text-gray-300  border-gray-300 pointer-events-none" : ""}`}
                                                size="account"
                                                variant={hasChanged ? "default" : "outline"}
                                            >
                                                SAVE CHANGES
                                            </Button>




                                        </div>
                                    </div>
                                </form>
                            </Form>
                        </div>



                    </div>

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

                    <div className="grid grid-cols-7 h-fit ">
                        <div className="col-span-3 bg-[#EBEBF3] rounded-s-sm" >
                            <div className="mx-10 my-8 space-y-4">
                                <div className="text-2xl font-semibold  whitespace-nowrap">
                                    DevArena Account Sign-In                                </div>
                                <div className="text-sm">
                                    We recommend that you periodically update your password to help prevent unauthorized access to your account.
                                </div>
                            </div>
                        </div>
                        <div className="col-span-4 bg-white relative rounded-e-sm" >
                            <Form {...accountSignInForm}>
                                <form onSubmit={accountSignInForm.handleSubmit(accountSignInOnSubmit)} className="space-y-4 m-8">



                                    <div className="flex-1 space-y-4">
                                        <FormField
                                            control={accountSignInForm.control}
                                            name="username"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Username</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="Enter your username" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={accountSignInForm.control}
                                            name="current-password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Current Password</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                id="current-password"
                                                                type={showPassword ? "text" : "password"}
                                                                placeholder="Enter your password"
                                                                className="pr-10"
                                                                {...field}
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="absolute bottom-1 right-1 h-7 w-7"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                            >
                                                                {showPassword ? <EyeOffIcon /> : <Eye />}
                                                                <span className="sr-only">
                                                                    Toggle password visibility
                                                                </span>
                                                            </Button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={accountSignInForm.control}
                                            name="new-password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>New Password</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                id="new-password"
                                                                type={showNewPassword ? "text" : "password"}
                                                                placeholder="Enter your password"
                                                                className="pr-10"
                                                                {...field}
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="absolute bottom-1 right-1 h-7 w-7"
                                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                            >
                                                                {showNewPassword ? <EyeOffIcon /> : <Eye />}
                                                                <span className="sr-only">
                                                                    Toggle password visibility
                                                                </span>
                                                            </Button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={accountSignInForm.control}
                                            name="confirm-password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Confirm Password</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                id="confirm-password"
                                                                type={showConfirmPassword ? "text" : "password"}
                                                                placeholder="Enter your password"
                                                                className="pr-10"
                                                                {...field}
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="absolute bottom-1 right-1 h-7 w-7"
                                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            >
                                                                {showConfirmPassword ? <EyeOffIcon /> : <Eye />}
                                                                <span className="sr-only">
                                                                    Toggle password visibility
                                                                </span>
                                                            </Button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="grid grid-cols-2 gap-2 !mt-10">
                                            {hasChangedAccountSignIn && (
                                                <Button
                                                    type="button"
                                                    className="col-span-1"
                                                    variant="cancel"
                                                    size="account"
                                                    onClick={() => accountSignInForm.reset(
                                                        defaultValuesAccountSignIn
                                                    )}
                                                >
                                                    CANCEL
                                                </Button>
                                            )}
                                            <Button
                                                type="submit"
                                                className={`col-span-1 font-semibold  col-start-2 ${!hasChangedAccountSignIn ? "text-gray-300  border-gray-300 pointer-events-none" : ""}`}
                                                size="account"
                                                variant={hasChangedAccountSignIn ? "default" : "outline"}
                                            >
                                                SAVE CHANGES
                                            </Button>




                                        </div>
                                    </div>
                                </form>
                            </Form>
                        </div>



                    </div>


                </div>
            </div>

        </div>
    );
}
