export type taskBoxProps = {
  todoId?: string;
  title?: string | undefined;
  description?: string | undefined;
  fromDate?: CalendarDate | undefined;
  toDate?: CalendarDate | undefined;
  mode?: "new" | "edit";
  isCompleted?: boolean;
};

export type Todos = {
  title: string | undefined;
  description: string | undefined;
  fromDate: CalendarDate | undefined;
  toDate: CalendarDate | undefined;
  todoId: string;
  userId: string;
  status: string;
};

export type allTodos = taskBoxProps[];
