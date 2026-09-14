"use client";
import ForgotPassword from "@/app/(auth)/auth/_components/ForgetPassword";
import { useUserStore } from "@/store/useUserStore";
import { loginResponse } from "@/types";
import { Button } from "@heroui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import NProgress from "nprogress";
import { useTheme } from "@/context/ThemeContext";
import { isValidEmail } from "@/utils/validation";
import BasicTextInput from "./BasicTextInput";

export default function Auth() {
  const router = useRouter();
  const [switchAuth, setSwitchAuth] = useState(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const userNameRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setEmailToStore = useUserStore((s) => s.setEmail);
  const { setTheme } = useTheme();
  const clearUserData = useUserStore((s) => s.clearUserData);

  async function handleSubmit(e?: React.FormEvent | any) {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    if (isLoading) return;
    setError(null);

    const currentUserName = (userName || userNameRef.current?.value || "").trim();
    const currentPassword = password || passwordRef.current?.value || "";

    if (!currentUserName || currentUserName.length <= 0) {
      setError("Invalid Username");
      return;
    }
    if (!currentPassword || currentPassword.length <= 0) {
      setError("Invalid Password");
      return;
    }

    setIsLoading(true);
    NProgress.start();
    const apiHost = process.env.host || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    try {
      if (switchAuth) {
        const response: loginResponse = await axios
          .post(`${apiHost}/authenticate/login`, {
            identifier: currentUserName,
            password: currentPassword,
          })
          .then((res) => res.data);
        handleApiResponse(response);
      } else {
        const currentEmail = (email || emailRef.current?.value || "").trim();
        if (!currentEmail || currentEmail.length <= 0) {
          setError("Invalid email");
          return;
        }
        if (!isValidEmail(currentEmail)) {
          setError("Invalid Mail format");
          return;
        }
        const response = await axios
          .post(`${apiHost}/authenticate/register`, {
            username: currentUserName,
            email: currentEmail,
            password: currentPassword,
          })
          .then((res) => res.data);
        setEmailToStore(currentEmail);
        handleApiResponse(response);
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
      NProgress.done();
    }
  }

  async function handleApiResponse(res: loginResponse) {
    if ("status" in res) {
      const message = res.message || "An error occurred.";
      setError(message);
      setIsLoading(false);
      NProgress.done();
    } else if ("other_message" in res) {
      const token = res.other_message;
      await fetch("/api/set-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      setIsLoading(false);
      NProgress.done();
      router.replace("/my-task");
    }
  }

  useEffect(() => {
    async function f() {
      await axios.get("/api/logout");
    }
    f();
    clearUserData();
    setTheme("system");
  }, []);

  useEffect(() => {
    const syncAutofill = () => {
      if (userNameRef.current?.value && !userName) {
        setUserName(userNameRef.current.value);
      }
      if (passwordRef.current?.value && !password) {
        setPassword(passwordRef.current.value);
      }
      if (!switchAuth && emailRef.current?.value && !email) {
        setEmail(emailRef.current.value);
      }
    };

    const t1 = setTimeout(syncAutofill, 100);
    const t2 = setTimeout(syncAutofill, 500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [switchAuth, userName, password, email]);

  useEffect(() => {
    setEmail("");
    setPassword("");
    setUserName("");
    setError(null);
    if (userNameRef.current) userNameRef.current.value = "";
    if (passwordRef.current) passwordRef.current.value = "";
    if (emailRef.current) emailRef.current.value = "";
  }, [switchAuth]);

  const ErrorBanner = () =>
    error ? (
      <div className="w-full text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2 text-center">
        {error}
      </div>
    ) : null;

  if (forgotPassword) {
    return (
      <div className="flex-1 backgroundColor flex flex-col items-center sm:w-[35dvw] text-light-textPrimary">
        <main className="w-3/4 sm:w-[80%] pt-[25%]">
          <h1 className="text-textPrimary text-3xl font-bold mb-[13%]">
            NOTEQUICK
          </h1>
          <ForgotPassword />
          <p className="text-center mt-6">
            Remember your password?{" "}
            <b
              className="cursor-pointer"
              onClick={() => setForgotPassword(false)}
            >
              <u>Back to Login</u>
            </b>
          </p>
        </main>
      </div>
    );
  }

  return (
    <>
      {switchAuth ? (
        <div className="flex-1 backgroundColor flex flex-col items-center sm:w-[35dvw] text-light-textPrimary ">
          <main className="w-3/4 sm:w-[80%]">
            <h1 className="text-textPrimary text-3xl font-bold pt-[25%]">
              NOTEQUICK
            </h1>
            <h1 className="text-textPrimary text-3xl font-bold pt-[13%]">
              Welcome Back!
            </h1>
            <div className="py-[7%]">
              <p className="text-base tracking-wide ">
                Don’t have an account ?{" "}
                <b
                  className="cursor-pointer whitespace-nowrap"
                  onClick={() =>
                    !isLoading ? setSwitchAuth((prev) => !prev) : null
                  }
                >
                  <u>Create a new account now.</u>
                </b>
              </p>
              <p className="text-base tracking-wide">
                It’s free takes less than a minute.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-y-4 sm:w-[75%]">
              <BasicTextInput
                name="username"
                inputRef={userNameRef}
                placeholder="Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                submit={handleSubmit}
              />
              <BasicTextInput
                name="password"
                inputRef={passwordRef}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                submit={handleSubmit}
                className="mb-[7%]"
              />
              <ErrorBanner />
              <Button
                type="submit"
                isLoading={isLoading}
                isDisabled={isLoading}
                className="justify-center w-full py-3.5 mb-6 text-white rounded-md bg-light-buttonPrimary hover:bg-buttonHover"
              >
                Login Now
              </Button>
              <p className="text-center">
                Forget Password ?
                <b
                  className="cursor-pointer"
                  onClick={() => setForgotPassword(true)}
                >
                  <u> Click here</u>
                </b>
              </p>
            </form>
          </main>
        </div>
      ) : (
        <div className="flex-1 backgroundColor flex flex-col items-center sm:w-[35dvw] text-light-textPrimary">
          <main className="w-3/4 sm:w-[80%]">
            <h1 className="text-textPrimary text-3xl font-bold pt-[25%]">
              NOTEQUICK
            </h1>
            <h1 className="text-textPrimary text-3xl font-bold pt-[13%]">
              Create Your Account
            </h1>
            <div className="py-[7%]">
              <p className="text-base tracking-wide ">
                Already have an account ?
                <b
                  className="cursor-pointer whitespace-nowrap"
                  onClick={() =>
                    !isLoading ? setSwitchAuth((prev) => !prev) : null
                  }
                >
                  <u>Login now.</u>
                </b>
              </p>
              <p className="text-base tracking-wide">
                It’s free takes less than a minute.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-y-4 sm:w-[75%]">
              <BasicTextInput
                name="username"
                autoComplete="username"
                inputRef={userNameRef}
                placeholder="Username"
                value={userName}
                submit={handleSubmit}
                onChange={(e) => setUserName(e.target.value)}
              />
              <BasicTextInput
                name="email"
                autoComplete="email"
                inputRef={emailRef}
                placeholder="Email"
                value={email}
                submit={handleSubmit}
                onChange={(e) => setEmail(e.target.value)}
              />
              <BasicTextInput
                name="password"
                autoComplete="new-password"
                inputRef={passwordRef}
                placeholder="Password"
                value={password}
                submit={handleSubmit}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-[7%]"
              />
              <ErrorBanner />
              <Button
                type="submit"
                isLoading={isLoading}
                isDisabled={isLoading}
                className="justify-center w-full py-3.5 mb-6 text-white rounded-md bg-light-buttonPrimary hover:bg-buttonHover"
              >
                Sign Up Now
              </Button>
            </form>
          </main>
        </div>
      )}
    </>
  );
}
