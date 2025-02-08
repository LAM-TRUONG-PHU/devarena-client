"use client";
import { LoadingSpinner } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOffIcon } from "lucide-react";
import { getSession, signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // New import
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { set } from "store";
import { z } from "zod";
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
    const router = useRouter();
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (session?.error) {
            handleRemoveError(session.error);
        }
    }, [session?.error]);
    const handleRemoveError = async (message: string) => {
        console.log(message);
        toast({
            title: "Login Error",
            description: message,
            variant: "error",
        });
        update({ error: "" });
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
            staySignedIn: false,
        },
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setLoading(true);
        const res = await signIn("credentials", {
            redirect: false,
            username: data.username,
            password: data.password,
        })

        if (res?.error) {
            toast({
                title: "Login Error",
                description: res.error,
                variant: "error",
            });
            setLoading(false);
        } else if (res?.ok) {
            await getSession().then((session) => {
                if (session?.user.role === "admin") {
                    router.push("/admin/study");
                } else {
                    router.push("/study");
                }
            }
            )
        }
    }

    async function onSubmitProvider(provider: string) {
        const res = await signIn(provider, {
            redirect: false,
        });
        console.log(res)
        if (res?.error) {
            console.log(res.error);
            toast({
                title: "Login Error",
                description: res.error,
                variant: "error",
            });
        }
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
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Enter your email" />
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
                                                {...field}
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
                                    className="flex-1 bg-blue_facebook text-white  px-4 py-2 rounded-xl shadow hover:bg-blue-700"
                                    onClick={(e) => {
                                        onSubmitProvider("discord");
                                    }}
                                >
                                    <FaDiscord className="w-6 h-6 mx-auto" />
                                </button>
                                <button
                                    type="button"
                                    className="flex-1 bg-white border-2 border-black  px-4 py-1 rounded-xl  hover:bg-gray-100"
                                    onClick={(e) => {
                                        onSubmitProvider("google");
                                    }}
                                >
                                    <FcGoogle className="w-6 h-6 mx-auto" />
                                </button>
                            </div>
                            <button
                                type="button"
                                className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-xl shadow hover:bg-gray-900"
                                onClick={(e) => {
                                    onSubmitProvider("github");
                                }}
                            >
                                <FaGithub className="w-6 h-6 mx-auto" />
                            </button>
                        </div>

                        <Button type="submit" className="w-full text-white px-4 py-2 rounded-lg shadow mt-10" disabled={loading}>
                            {loading ? (<LoadingSpinner />) : "Login"}
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
