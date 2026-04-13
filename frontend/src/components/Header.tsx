import React from "react";

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
  onClick?:()=>void;
}

export default function Header({ className, children,onClick }: HeaderProps) {
  return (
    <p className={`text-2xl font-bold text-textPrimary ${className}`} onClick={onClick}>
      {children}
    </p>
  );
}
