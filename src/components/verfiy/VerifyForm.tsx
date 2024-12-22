'use client'
import React, { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

const VerifyForm = () => {
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
  return (
    <div>
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <div className="flex space-x-2">
          <Input
            id="email"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="button" variant="outline" onClick={handleResend}>
            Resend
          </Button>
        </div>
      </div>
      <div className="flex flex-col space-y-1.5">
              <Label htmlFor="otp">One-Time Password</Label>
              <InputOTP
                value={otp}
                onChange={setOtp}
                maxLength={6}
              >
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
    </div>
  );
};

export default VerifyForm;
