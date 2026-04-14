"use client";
import { Button } from "@heroui/react";
import axios from "axios";
import { useState } from "react";
import NProgress from "nprogress";
import { loginResponse } from "@/types";
import InputButton from "@/utils/InputButton";

type Step = "email" | "otp" | "password";

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendOtp = async () => {
    if (!email) return;
    try {
      setIsLoading(true);
      NProgress.start();
      setError("");
      const res = await axios.post(
        `${process.env.host}/authenticate/forgot-password`,
        {
          email,
        },
      );
      const data: loginResponse = res.data;
      if ("status_code" in data && data.status_code !== 200) {
        setError(data.message || "No account found with this email");
        return;
      }
      
      if ("status" in data && data.status !== 200) {
        setError(data.message || "No account found with this email");
        return;
      }
      setStep("otp");
    } catch (e: any) {
      setError(e.response?.data?.message || "No account found with this email");
    } finally {
      NProgress.done();
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return;
    try {
      setIsLoading(true);
      NProgress.start();
      setError("");
      const res = await axios.post(
        `${process.env.host}/authenticate/verify-otp`,
        {
          email,
          otp,
        },
      );

      const data: loginResponse = res.data;

      if ("status_code" in data && data.status_code !== 200) {
        setError(data.message || "Invalid or expired OTP");
        return;
      }

      if ("status" in data && data.status !== 200) {
        setError(data.message || "Invalid or expired OTP");
        return;
      }

      setStep("password");
    } catch (e: any) {
      setError(e.response?.data?.message || "Invalid or expired OTP");
    } finally {
      NProgress.done();
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    try {
      setIsLoading(true);
      NProgress.start();
      setError("");
      const res = await axios.post(
        `${process.env.host}/authenticate/reset-password`,
        {
          email,
          otp,
          newPassword,
        },
      );
      const data: loginResponse = res.data;
      if ("status_code" in data && data.status_code !== 200) {
        setError(data.message || "Invalid or expired OTP");
        return;
      }

      if ("status" in data && data.status !== 200) {
        setError(data.message || "Invalid or expired OTP");
        return;
      }
      setSuccess("Password reset successfully!");
      setTimeout(() => window.location.reload(), 1500);
    } catch (e: any) {
      setError(e.response?.data?.message || "Invalid OTP or request expired");
      setStep("otp");
    } finally {
      NProgress.done();
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm mx-auto">
      <div className="flex items-center gap-2">
        {(["email", "otp", "password"] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors
              ${
                step === s
                  ? "bg-light-buttonPrimary dark:bg-dark-buttonPrimary text-white"
                  : ["email", "otp", "password"].indexOf(step) > i
                    ? "bg-emerald-500 text-white"
                    : "bg-light-borderPrimary dark:bg-dark-borderPrimary text-light-textMuted"
              }`}
            >
              {["email", "otp", "password"].indexOf(step) > i ? "✓" : i + 1}
            </div>
            {i < 2 && (
              <div
                className={`h-px w-8 ${["email", "otp", "password"].indexOf(step) > i ? "bg-emerald-500" : "bg-light-borderPrimary dark:bg-dark-borderPrimary"}`}
              />
            )}
          </div>
        ))}
      </div>
      {step === "email" && (
        <>
          <div>
            <h2 className="text-2xl font-bold text-light-textPrimary ">
              Forgot password?
            </h2>
            <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mt-1">
              Enter your email and we&apos;ll send you an OTP
            </p>
          </div>
          <InputButton
            placeholder="Email"
            value={email}
            inputClassName="flex w-full"
            customTheme="formField"
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <p className="text-xs text-rose-500">{error}</p>}
          <Button
            className="bg-light-buttonPrimary dark:bg-dark-buttonPrimary text-white rounded-lg h-11"
            isLoading={isLoading}
            onPress={handleSendOtp}
          >
            Send OTP
          </Button>
        </>
      )}
      {step === "otp" && (
        <>
          <div>
            <h2 className="text-2xl font-bold text-light-textPrimary ">
              Enter OTP
            </h2>
            <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mt-1">
              We sent a 6-digit code to{" "}
              <span className="font-medium">{email}</span>
            </p>
          </div>
          <InputButton
            placeholder="OTP"
            value={otp}
            inputClassName="flex w-full"
            customTheme="formField"
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          />
          {error && <p className="text-xs text-rose-500">{error}</p>}
          <Button
            className="bg-light-buttonPrimary dark:bg-dark-buttonPrimary text-white rounded-lg h-11"
            isLoading={isLoading}
            onPress={handleVerifyOtp}
            isDisabled={otp.length !== 6 || isLoading}
          >
            Verify OTP
          </Button>
          <button
            className="text-sm text-light-textSecondary dark:text-dark-textSecondary underline self-center"
            onClick={() => {
              setStep("email");
              setError("");
            }}
          >
            Wrong email? Go back
          </button>
        </>
      )}
      {step === "password" && (
        <>
          <div>
            <h2 className="text-2xl font-bold text-light-textPrimary">
              New password
            </h2>
            <p className="text-sm text-light-textSecondarymt-1">
              Choose a strong password
            </p>
          </div>
          <InputButton
            placeholder="New Password"
            value={newPassword}
            inputType="password"
            customTheme="formField"
            inputClassName="flex w-full"
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <InputButton
            placeholder="Confirm Password"
            value={confirmPassword}
            inputType="password"
            customTheme="formField"
            inputClassName="flex w-full"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <p className="text-xs text-rose-500">{error}</p>}
          {success && <p className="text-xs text-emerald-500 text-center">{success}</p>}
          <Button
            className="bg-light-buttonPrimary dark:bg-dark-buttonPrimary text-white rounded-lg h-11"
            isLoading={isLoading}
            onPress={handleResetPassword}
            isDisabled={!newPassword || !confirmPassword}
          >
            Reset Password
          </Button>
        </>
      )}
    </div>
  );
}
