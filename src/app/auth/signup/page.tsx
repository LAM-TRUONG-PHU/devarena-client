"use client";
import { LoadingSpinner } from "@/components/loading";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import useAxios from "@/hooks/useAxios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOffIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
const formSchema = z
    .object({
        username: z.string().min(1, {
            message: "required",
        }),
        email: z.string().email({
            message: "invalid email",
        }),
        password: z
            .string()
            .min(6, { message: "Password must be at least 6 characters long" })
            .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
            .regex(/[0-9]/, { message: "Password must contain at least one number" }),
        "confirm-password": z.string().min(1, {
            message: "required",
        }),
    })
    .refine((data) => data.password === data["confirm-password"], {
        message: "Passwords do not match",
        path: ["confirm-password"],
    });
export default function SignUpPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const axiosIntance = useAxios()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false);

    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            "confirm-password": "",
        },
    });
    function onSubmit(data: z.infer<typeof formSchema>) {
        setLoading(true)
        axiosIntance.post("/auth/signup", {
            email: data.email,
            password: data.password,
            username: data.username,
            provider: "credentials"
        }).then((res) => {
            console.log(res)
            toast({
                variant: "success",
                title: "Đăng ký thành công",
                description: "Hãy vào gmail để lấy mã OTP"
            })
            router.push(`/auth/verify?email=${data.email}`)
        }).catch((e) => {
            console.log(e)
            toast({
                variant: "error",
                title: "Đăng ký thất bại",
                // description:"Hãy vào gmail để lấy mã OTP"
            })
        })
    }

    return (
        <>
            <div className="w-full flex justify-center space-x-10 items-center">
                <div className="space-y-4">
                    <Image
                        className="dark:invert"
                        src="https://res.cloudinary.com/dlfsdepfc/image/upload/v1739701395/logo1_nclmbo.png"
                        alt="DevArena logo"
                        width={300}
                        height={300}
                        
                    />
                    <h1 className="scroll-m-20 text-4xl font-medium tracking-tight lg:text-xl">
                        🏆 Level Up Your Coding Skills
                    </h1>
                    <h1 className="scroll-m-20 text-4xl font-medium tracking-tight lg:text-xl">
                        🎮 Compete and Climb Ranks
                    </h1>
                    <h1 className="scroll-m-20 text-4xl font-medium tracking-tight lg:text-xl">
                        📚 Learn by Doing
                    </h1>
                    <p>Join DevArena now and become a coding champion!</p>
                </div>
                <div className="w-full max-w-lg bg-white px-12 py-8 rounded-md shadow-lg my-4">
                    <h1 className="scroll-m-20 text-4xl font-medium tracking-tight lg:text-2xl text-black mb-4">
                        Create your account
                    </h1>

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
                                name="email"
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
                                render={({ field, fieldState }) => (
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
                                                    <span className="sr-only">
                                                        Toggle password visibility
                                                    </span>
                                                </Button>
                                            </div>
                                        </FormControl>
                                        {!fieldState.error && (
                                            <FormDescription className="text-xs">
                                                Must contain 6+ characters, including at least 1 letter and 1
                                                number.
                                            </FormDescription>
                                        )}
                                        <FormMessage className="text-right" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirm-password"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel>Confirm password"</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    id="confirm-password"
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    placeholder="Enter confirm password"
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
                                        <FormMessage className="text-right" />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full text-white px-4 py-2 rounded-lg shadow mt-10"
                            >
                                {loading ? (<LoadingSpinner />) : "Create Account"}
                            </Button>
                        </form>
                    </Form>

                    <div className="text-center mt-4 flex flex-col">
                        <Link href="/auth/login" className="text-sm text-pink-500 hover:underline">
                            ALREADY HAVE AN ACCOUNT?
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
