"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { FaFacebook, FaGithub, FaDiscord } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { EyeOffIcon, Eye } from "lucide-react";
const formSchema = z.object({
    username: z.string().min(1, {
        message: "required",
    }),
    password: z.string().min(1, {
        message: "required",
    }),
    staySignedIn: z.boolean(),
});

export default function LoginPage() {
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
            staySignedIn: false,
        },
    });

    function onSubmit(data: z.infer<typeof formSchema>) {
        console.log(data);
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        });
    }

    return (
        <>
            <div className="w-full max-w-lg bg-white p-12 rounded-md shadow-lg">
                <Image
                    className="dark:invert mx-auto"
                    src="/logo.png"
                    alt="DevArena logo"
                    width={150}
                    height={150}
                />

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Enter your username" />
                                    </FormControl>
                                    <FormMessage className="text-right" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                id="password"
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
                                                <span className="sr-only">Toggle password visibility</span>
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-right" />
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-col space-y-3 mt-2">
                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    className="flex-1 bg-blue_discord text-white  px-4 py-2 rounded-xl shadow hover:brightness-110"
                                >
                                    <FaDiscord className="w-6 h-6 mx-auto" />
                                </button>
                                <button
                                    type="button"
                                    className="flex-1 bg-white border-2 border-black  px-4 py-1 rounded-xl  hover:bg-gray-100"
                                >
                                    <FcGoogle className="w-6 h-6 mx-auto" />
                                </button>
                            </div>
                            <button
                                type="button"
                                className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-xl shadow hover:brightness-110"
                            >
                                <FaGithub className="w-6 h-6 mx-auto" />
                            </button>
                        </div>

                        <FormField
                            control={form.control}
                            name="staySignedIn"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 ">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel className="text-foreground">Stay signed in</FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full text-white px-4 py-2 rounded-lg shadow mt-10">
                            Login
                        </Button>
                    </form>
                </Form>

                <div className="text-center mt-4 flex flex-col">
                    <Link href="/auth/forgot-password" className="text-sm text-foreground hover:underline">
                        FORGOT PASSWORD?
                    </Link>
                    <Link href="/auth/signup" className="text-sm text-pink-500 hover:underline">
                        CREATE ACCOUNT
                    </Link>
                </div>
            </div>
        </>
    );
}
