import { Checkbox } from "@heroui/react";
import React from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import Divider from "@/utils/Divider";
import { allTodos, taskBoxProps } from "@/types";
import { onSaveTodo } from "@/actions/onSaveTodo";
import { TodoStatus } from "@/enum/TodoStatus";

interface TodoListProps {
  taskData: taskBoxProps;
  setTaskData: (data: taskBoxProps) => void;
  allTodos: allTodos;
  setAllTodos: (todos: allTodos) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  taskData,
  setTaskData,
  allTodos,
  setAllTodos,
}) => {
  return (
    <div
      className="flex flex-col sm:w-[40.8%] cursor-pointer"
      onClick={() => setTaskData(taskData)}
    >
      <div className="flex justify-between items-center py-4">
        <Checkbox
          color="secondary"
          lineThrough={true}
          isSelected={taskData?.status === TodoStatus.COMPLETED}
          onValueChange={async (isSelected) => {
            const status = isSelected ? TodoStatus.COMPLETED : TodoStatus.ACTIVE;
            setAllTodos(
              allTodos.map((value) => {
                if (value.todoId === taskData.todoId) {
                  return { ...value, status };
                } else {
                  return value;
                }
              })
            );
            onSaveTodo({...taskData,status})
          }}
        >
          {taskData.title}
        </Checkbox>
        <MdOutlineKeyboardArrowRight />
      </div>
      <Divider className="w-full" />
    </div>
  );
};

export default TodoList;
