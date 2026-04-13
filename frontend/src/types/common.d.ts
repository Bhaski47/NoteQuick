
export type ActionButtonProps = {
  name: string;
  onClick: () => void;
  className?: string | undefined;
};

export type NavigateButtonProps = {
  name: string;
  path: string;
  className?: string;
  icon: string | undefined;
  iconLibrary: "md5" | "io5" | undefined;
  className: string | undefined;
  selectedClassName: string | undefined;
  unSelectedClassName: string | undefined;
};

export type DividerProps = {
  className?: string | undefined
}

export type InputButtonProps = {
  buttonClassName?: string | undefined,
  placeholder:string,
  inputClassName?: string | undefined,
  placeholderClassName?: string | undefined,
  value?: string | undefined,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?:boolean | undefined
  customTheme?:string | undefined
  inputType?:string | undefined
}


export type Theme = 'light' | 'dark' | 'custom' | 'system';