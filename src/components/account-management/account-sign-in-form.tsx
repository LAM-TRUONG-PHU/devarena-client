"use client";
import { EyeOffIcon, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { usePrivate } from "@/hooks/usePrivateAxios";

const accountSignInFormSchema = z
    .object({
        "current-password": z.string().min(1, { message: "Required" }),
        "new-password": z
            .string()
            .min(6, { message: "Password must be at least 6 characters long" })
            .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
            .regex(/[0-9]/, { message: "Password must contain at least one number" }),
        "confirm-password": z.string().min(1, { message: "Required" }),
    })
    .refine((data) => data["new-password"] === data["confirm-password"], {
        path: ["confirm-password"], // path of error
        message: "Passwords do not match",
    });

export default function AccountSignInForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { toast } = useToast();
    const { data:session,update}=useSession()
    const axios =usePrivate()
    const defaultValuesAccountSignIn = {
        "current-password": "",
        "new-password": "",
        "confirm-password": "",
    };

    const accountSignInForm = useForm<z.infer<typeof accountSignInFormSchema>>({
        resolver: zodResolver(accountSignInFormSchema),
        defaultValues: defaultValuesAccountSignIn,
    });

    const watchFieldsAccountSignIn = accountSignInForm.watch();
    const hasChangedAccountSignIn = Object.keys(defaultValuesAccountSignIn).some(
        (key) =>
            watchFieldsAccountSignIn[key as keyof typeof defaultValuesAccountSignIn] !==
            defaultValuesAccountSignIn[key as keyof typeof defaultValuesAccountSignIn]
    );

    async function accountSignInOnSubmit(data: z.infer<typeof accountSignInFormSchema>) {
        // if(session?.user.isCreatePassword){
            
        // }
        // else{

        // }
        console.log("djjd")
        await axios.post("/auth/update-password",{
            isCreatePassword:session?.user.isCreatePassword,
            oldPassword:data["current-password"],
            newPassword:data["new-password"]
        }).then((res)=>{
            
            toast({
                title: "Change your password successfully!",
                variant:"success"
            });
        }).catch((err)=>{
            console.log(err)
            if(err.response.data.message ==="Old password is incorrect."){
                toast({
                    title: "Old password is incorrect!",
                    variant:"error"
                });
            }
        })
       
    }
    return (
        <div className="grid lg:grid-cols-7 lg:grid-rows-none grid-rows-3 h-fit ">
            <div className="lg:col-span-3 row-span-1 bg-[#EBEBF3] rounded-s-sm">
                <div className="mx-10 my-8 space-y-4">
                    <div className="text-2xl font-semibold  xl:whitespace-nowrap">
                        DevArena Account Sign-In{" "}
                    </div>
                    <div className="text-sm">
                        We recommend that you periodically update your password to help prevent unauthorized
                        access to your account.
                    </div>
                </div>
            </div>
            <div className="lg:col-span-4  row-span-2 lg:row-span-1 bg-white relative rounded-e-sm">
                <Form {...accountSignInForm}>
                    <form
                        onSubmit={accountSignInForm.handleSubmit(accountSignInOnSubmit)}
                        className="space-y-4 m-8"
                    >
                        <div className="flex-1 space-y-4">
                            {/* <div className="mb-8">
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
                            </div> */}

                            <div className="text-xl font-medium">Change Password</div>
                            {
                            session?.user.isCreatePassword ===true &&

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
                            }
                           
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
                                                    onClick={() =>
                                                        setShowConfirmPassword(!showConfirmPassword)
                                                    }
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
                                        onClick={() => accountSignInForm.reset(defaultValuesAccountSignIn)}
                                    >
                                        CANCEL
                                    </Button>
                                )}
                                <Button
                                    type="submit"
                                    className={`col-span-1 font-semibold  col-start-2 ${
                                        !hasChangedAccountSignIn
                                            ? "text-gray-300  border-gray-300 pointer-events-none"
                                            : ""
                                    }`}
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
    );
}
