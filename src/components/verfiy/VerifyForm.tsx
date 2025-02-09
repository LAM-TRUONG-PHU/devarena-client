"use client";
import React, { Suspense, useEffect, useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import useAxios from "@/hooks/useAxios";
import { useToast } from "@/hooks/use-toast";

const VerifyForm = () => {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email"); // Lấy giá trị 'email' từ query string
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const axiosInstance = useAxios();
  const { toast } = useToast();
  const router = useRouter()
  useEffect(() => {
    if (emailParam !== "") {
      setEmail(emailParam!);
    }
  }, [emailParam]);

  const handleVerify = async () => {
    setLoading(true); // Bắt đầu loading
    try {
      const res = await axiosInstance.post("/auth/verify", {
        email,
        otpCode: otp,
      });
      toast({
        variant: "success",
        title: "Xác thực thành công",
        description: "Tài khoản của bạn đã được xác thực!",
      });
      router.push("/auth/login")
    } catch (error) {
      toast({
        variant: "error",
        title: "Xác thực thất bại",
        description: "OTP không hợp lệ hoặc đã hết hạn.",
      });
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  const handleResend = async () => {
    setLoading(true); // Bắt đầu loading
    try {
      await axiosInstance.post("/auth/resend-otp", { email });
      toast({
        variant: "success",
        title: "Gửi lại OTP thành công",
        description: "Hãy kiểm tra email của bạn để lấy mã OTP mới.",
      });
    } catch (error) {
      toast({
        variant: "error",
        title: "Không thể gửi lại OTP",
        description: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
      });
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  useEffect(() => {
    if (otp.length === 6) {
      handleVerify(); // Gửi API xác thực khi đủ 6 ký tự
    }
  }, [otp]);

  return (
    <Suspense fallback={<p>loading</p>}>
      <div className="flex flex-col space-y-1.5 gap-4">
        <Label htmlFor="email">Email</Label>
        <div className="flex space-x-2">
          <Input
            id="email"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading} // Vô hiệu hóa khi loading
          />
          <Button
            type="button"
            variant="default"
            onClick={handleResend}
            disabled={loading} // Vô hiệu hóa khi loading
          >
            {loading ? "Loading..." : "Resend"}
          </Button>
        </div>
      </div>
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="otp">One-Time Password</Label>
        <InputOTP value={otp} onChange={setOtp} maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      {loading && <p className="text-center mt-2">Đang xử lý...</p>}
    </Suspense>
  );
};

export default VerifyForm;
