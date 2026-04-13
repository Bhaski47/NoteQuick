"use client";
import ForgotPassword from "@/app/(auth)/auth/_components/ForgetPassword";
import { useUserStore } from "@/store/useUserStore";
import { loginResponse } from "@/types";
import { Button } from "@heroui/react";
import axios from "axios";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Auth() {
  const [switchAuth, setSwitchAuth] = useState(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const setEmailToStore = useUserStore((s) => s.setEmail);
  const clearUserData = useUserStore((s) => s.clearUserData);

  async function handleSubmit() {
    setIsLoading(true);
    if (switchAuth) {
      const response: loginResponse = await axios
        .post(`${process.env.host}/authenticate/login`, {
          identifier: userName,
          password,
        })
        .then((res) => res.data);
      handleApiResponse(response).then(() => redirect("/my-task"));
      setIsLoading(false);
    } else {
      const response = await axios
        .post(`${process.env.host}/authenticate/register`, {
          username: userName,
          email,
          password,
        })
        .then((res) => res.data);
      setEmailToStore(email);
      handleApiResponse(response).then(() => redirect("/my-task"));
      setIsLoading(false);
    }
  }

  async function handleApiResponse(res: loginResponse) {
    if ("status" in res) {
      if (res.status !== 200) {
        alert(res.message);
        throw new Error(res.message);
      }
    } else if ("other_message" in res) {
      const token = res.other_message;
      await fetch("/api/set-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      redirect("/my-task");
    }
  }

  useEffect(() => {
    async function f() {
      await axios.get("/api/logout");
    }
    f();
    clearUserData();
  }, []);

  useEffect(() => {
    setEmail("");
    setPassword("");
    setUserName("");
  }, [switchAuth]);if (forgotPassword) {
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
            <div className="flex flex-col gap-y-4 sm:w-[75%]">
              <input
                type="text"
                className="border-0 border-b-2 border-b-black px-2 py-2 outline-none rounded-none sm:rounded-none"
                placeholder="Username"
                autoComplete="off"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <input
                type="password"
                className="border-0 border-b-2 border-b-black px-2 py-2 outline-none rounded-none sm:rounded-none mb-[7%]"
                placeholder="Password"
                autoComplete="off"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                isLoading={isLoading}
                isDisabled={isLoading}
                onPress={handleSubmit}
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
                  <u>Click here</u>
                </b>
              </p>
            </div>
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
            <div className="flex flex-col gap-y-4 sm:w-[75%]">
              <input
                type="text"
                autoComplete="off"
                className="border-0 border-b-2 border-b-black px-2 py-2 outline-none rounded-none sm:rounded-none"
                placeholder="Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <input
                type="text"
                className="border-0 border-b-2 border-b-black px-2 py-2 outline-none rounded-none sm:rounded-none"
                placeholder="Email"
                autoComplete="false"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                className="border-0 border-b-2 border-b-black px-2 py-2 outline-none rounded-none sm:rounded-none mb-[7%]"
                placeholder="Password"
                autoComplete="false"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                isLoading={isLoading}
                isDisabled={isLoading}
                onPress={handleSubmit}
                className="justify-center w-full py-3.5 mb-6 text-white rounded-md bg-light-buttonPrimary hover:bg-buttonHover"
              >
                Sign Up Now
              </Button>
            </div>
          </main>
        </div>
      )}
    </>
  );
}
