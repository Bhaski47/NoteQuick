"use server"
import { taskBoxProps } from "@/types";
import { getAllTodos } from "./getAllTodos";
import axios from "axios";
import { cookies } from "next/headers";
import { CalendarDate } from "@internationalized/date";

export async function onSaveTodo(taskData:taskBoxProps,fromDate?:CalendarDate,toDate?:CalendarDate){
    const token = (await cookies()).get("token")?.value;
    await axios.post(`${process.env.host}/todos/updateTodo`,{
      ...taskData,fromDate:fromDate,toDate:toDate
    },{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await getAllTodos()
  }
