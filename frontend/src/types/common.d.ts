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
  selectedClassName: string | undefined;
  unSelectedClassName: string | undefined;
};

export type DividerProps = {
  className?: string | undefined;
};

export type InputButtonProps = {
  buttonClassName?: string | undefined;
  placeholder: string;
  inputClassName?: string | undefined;
  placeholderClassName?: string | undefined;
  value?: string | undefined;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean | undefined;
  customTheme?: string | undefined;
  inputType?: string | undefined;
};

export type BasicTextInputType = {
  placeholder: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string | undefined;
  submit: () => void;
  name?: string;
  id?: string;
  autoComplete?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  type?: string;
};

export type Theme = "light" | "dark" | "custom" | "system";
