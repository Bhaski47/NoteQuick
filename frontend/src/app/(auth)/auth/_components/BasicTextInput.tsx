import { BasicTextInputType } from "@/types";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

export default function BasicTextInput({
  placeholder,
  value,
  onChange,
  className,
  submit,
  name,
  id,
  autoComplete,
  inputRef,
  type,
}: BasicTextInputType) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = placeholder.toLowerCase() === "password";
  const inputType =
    type ?? (!isPassword ? "text" : isPassword && showPassword ? "text" : "password");

  return (
    <div
      onKeyDown={(k) => k.key === "Enter" && submit()}
      className={`w-full border-0 border-b-2 border-b-black px-2 py-2 outline-none rounded-none sm:rounded-none flex justify-between ${className ?? ""}`}
    >
      <input
        ref={inputRef}
        name={name}
        id={id}
        type={inputType}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent outline-none"
      />
      {isPassword && (
        <div
          className="self-end cursor-pointer"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}
        </div>
      )}
    </div>
  );
}
