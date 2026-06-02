import { BasicTextInputType } from "@/types";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

export default function BasicTextInput(e: BasicTextInputType) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = e.placeholder.toLowerCase() === "password";
  return (
    <div
      onKeyDown={(k) => k.key === "Enter" && e.submit()}
      className={`w-full border-0 border-b-2 border-b-black px-2 py-2 outline-none rounded-none sm:rounded-none flex justify-between ${e.className}`}
    >
      <input
        type={!isPassword ? "text" : isPassword && showPassword ? "text" : "password" }
        placeholder={e.placeholder}
        autoComplete="false"
        value={e.value}
        onChange={e.onChange}
        className="w-full"
      />
      {isPassword && (
        <div className="self-end" onClick={() => setShowPassword(prev => !prev)}>
          {showPassword ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}
        </div>
      )}
    </div>
  );
}
