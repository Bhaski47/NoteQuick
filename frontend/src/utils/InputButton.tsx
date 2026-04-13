import { useTheme } from "@/context/ThemeContext";
import { InputButtonProps } from "@/types";
import React from "react";

export default function InputButton({
  placeholder,
  buttonClassName,
  inputClassName,
  placeholderClassName,
  value,
  onChange,
  disabled=false,
  customTheme = undefined,
  inputType
}: InputButtonProps) {
  const { theme } = useTheme();
  const isFilled = !!value && value.length > 0;
  return (
    <div
      className={`${customTheme === undefined ? theme === "light" ? "formField" : "darkformField" : customTheme} ${buttonClassName}`}
    >
      <input
        required
        type={inputType !== undefined ? inputType : "text"}
        className={`${inputClassName}`}
        defaultValue={value}
        onChange={onChange}
        disabled={disabled}
      />
      <span className={`${placeholderClassName} ${isFilled ? "filled" : ""}`}>
        {placeholder}
      </span>
    </div>
  );
}
