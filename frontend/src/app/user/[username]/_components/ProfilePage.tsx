"use client";
// import { useTheme } from "@/context/ThemeContext";
import { Props } from "@/types/profile";
import NavCard from "./NavCard";
import InfoCard from "./InfoCard";
import { useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function ProfilePage({ data }: Props) {
  const {setTheme} = useTheme();
  useEffect(() => {
    setTheme('light')
  }, []);
  console.log("data")
  console.log(data)
  return (
    <div>
      <main className="w-[90%] md:w-[70%] m-auto ">
        <div className="flex justify-between my-4 ">
          <div>
            <header>
              <p className="text-light-textSecondary">Profile</p>
            </header>
            <header className="flex justify-between">
              <p className="font-bold text-4xl">{data.userName}</p>
            </header>
          </div>
          <header className="self-end">
            <div className=" rounded-full p-4 h-8 flex justify-between gap-x-2 shadow-[0_0_8px_rgba(0,0,0,0.1)]">
              <div className="w-2 h-2 bg-emerald-500 rounded-full self-center"></div>
              <p className="text-xs self-center">Active Account</p>
            </div>
          </header>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-auto">
            <div className="flex flex-col w-full md:w-96 gap-3 px-4 py-6 rounded-3xl shadow-lg border border-gray-100">
              {/* shadow-[0_0_10px_rgba(0,0,0,0.2)]} */}
              <div className="rounded-3xl bg-black w-20 h-20 flex items-center justify-center">
                <h2 className="text-white text-3xl font-semibold">{data?.userName?.length >=2 ? data?.userName?.slice(0,2).toUpperCase() : data?.userName?.toUpperCase() }</h2>
              </div>

              <span className="font-medium text-2xl">{data.name}</span>
              <p>@{data.userName}</p>
              <p className="text-wrap">

              </p>
              <div className="flex flex-row gap-x-4">
                <p className="rounded-full bg-light-borderPrimary px-2 py-1">
                  {data.email || "-"}
                </p>
                <p className="rounded-full bg-light-borderPrimary px-2 py-1">
                  {data.gender === "-" || data.gender.length === 0 ? "Unknown" : data.gender}
                </p>
              </div>
              <div className="flex justify-between gap-x-6">
                <div className="rounded-lg p-4 bg-light-backgroundProfileCard w-full">
                  <p className="text-light-textSecondary">TOTAL TASKS</p>
                  <p className="text-2xl">{(data.activeTodoCount || 0) + (data.completedTodoCount || 0) + (data.removedTodoCount || 0)}</p>
                </div>
                <div className="rounded-lg p-4 bg-light-backgroundProfileCard w-full">
                  <p className="text-light-textSecondary">STATUS</p>
                  <p className="text-2xl text-emerald-500">ACTIVE</p>
                </div>
              </div>
            </div>
          </aside>
          <div className="w-full">
            <nav className="grid grid-cols-1 sm:grid-cols-2 md:flex gap-4">
              <NavCard name="ACTIVE TODOS" wrapperClassStyle="bg-black text-white" values={data.activeTodoCount} />
              <NavCard name="COMPLETED" wrapperClassStyle="bg-emerald-50 border-emerald-200 border-2" values={data.completedTodoCount} valueClassStyle="text-emerald-500" titleClassStyle="text-emerald-500"/>
              <NavCard name="REMOVED" wrapperClassStyle="bg-rose-50 border-rose-200 border-2" values={data.removedTodoCount} valueClassStyle="text-rose-500" titleClassStyle="text-rose-500"/>
            </nav>
            <section className="shadow-lg my-6 rounded-3xl border border-gray-100 p-6">
              <div className="my-4">
                <p className="text-light-textSecondary">Personal Information</p>
                <h2 className="font-semibold">Account Details</h2>
              </div>
              <div className="flex flex-wrap gap-6">
                <InfoCard name={data.name} title="FULL NAME" />
                <InfoCard name={data.userName} title="USERNAME" />
                <InfoCard name={data.email} title="EMAIL" />
                <InfoCard name={data.phNo} title="PHONE" />
                <InfoCard name={data.gender} title="GENDER" />
                <InfoCard name={data.birthDay} title="BIRTHDAY" />
                <InfoCard name={data.city} title="CITY" />
                <InfoCard name={data.country} title="COUNTRY" />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
