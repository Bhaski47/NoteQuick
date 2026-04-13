import React from "react";
import Auth from "../../../components/Auth";

export default function Page() {
  // const [switchAuth, setSwitchAuth] = useState(false);

  return (
    <main className="flex flex-row h-svh">
      <div
        className="w-[65vw] text-white
       bg-gradient-to-br from-[#4643B5] to-[#131890] hidden md:flex"
      >
        <div className="mx-auto pt-[30vh] flex flex-col gap-7 ">
          <h1 className="text-6xl font-bold">Hello Overthinker! ✨</h1>
          <span className="text-xl text-left font-bold">
            <p>Pause the noise. Start the flow.</p>
            <p>NoteQuick: Where “someday” becomes “done today.”</p>
          </span>
        </div>
      </div>
      <Auth/>
    </main>
  );
}
