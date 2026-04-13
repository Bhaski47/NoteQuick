import React, { useState } from "react";

interface StaticInputProps {
  label: string;
  placeholder?: string;
  inputValue?: string;
}

const StaticInput: React.FC<StaticInputProps> = ({
  label,
  placeholder,
  inputValue,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`border-2 light:border-light-borderSecondary dark:border-dark-textPrimary dark:bg-dark-backgroundColor
  rounded-full h-10 flex items-center w-full sm:w-auto min-w-0 cursor-default transition-all duration-200 overflow-hidden
  ${isFocused ? "border-[#333232] shadow-[0_0_0_2px_#333232]" : "hover:border-[#333232] hover:shadow-[0_0_0_2px_#333232]"}
`}
      onClick={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      tabIndex={0}
    >
      <p className="whitespace-nowrap overflow-hidden text-ellipsis select-none px-4 h-full flex items-center bg-light-borderSecondary dark:bg-dark-backgroundColor dark:text-dark-textPrimary shrink-0">
        {label}
      </p>
      <input
        type="text"
        placeholder={placeholder}
        className="px-4 h-full border-none outline-none flex-1 min-w-0 w-full 
        bg-white dark:bg-dark-backgroundColor dark:text-dark-textPrimary"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        value={inputValue}
        disabled
      />
    </div>
  );
};

export default StaticInput;
