import { TodoStatus } from "@/enum/TodoStatus";

export type taskBoxProps = {
  todoId?: string;
  title?: string | undefined;
  description?: string | undefined;
  fromDate?: CalendarDate | undefined;
  toDate?: CalendarDate | undefined;
  mode?: "new" | "edit";
  status?: TodoStatus;
  tags?: string[];
};

export type Todos = {
  title: string | undefined;
  description: string | undefined;
  fromDate: CalendarDate | undefined;
  toDate: CalendarDate | undefined;
  todoId: string;
  userId: string;
  status: string;
  tags?: string[];
};

export type allTodos = taskBoxProps[];
