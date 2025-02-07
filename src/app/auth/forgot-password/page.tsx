"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePrivate } from "@/hooks/usePrivateAxios";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export default function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const axios =usePrivate()
  const onSubmit =async (data: any) => {
    console.log("Forgot Password Request:", data);
    // Call API to send reset link
    await axios.get(`/auth/forgot-password/${data.email}`)
  };

  return (
    <Card className="w-[350px] mx-auto">
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input {...register("email")} type="email" placeholder="Enter your email" />
          </div>
          <Button type="submit" className="w-full">Send Reset Link</Button>
        </form>
      </CardContent>
    </Card>
  );
}
