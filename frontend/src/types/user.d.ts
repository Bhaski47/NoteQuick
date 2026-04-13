import { UserStatus } from "@/enum/UserStatus";
import { failedResponse } from "./auth";

export interface TabNavigateProps {
  userDetails: User;
}

export type User = {
    userId: string;
    email: string;
    gender: string | null;
    birthday: string | null;
    city: string | null;
    country: string | null;
    phone: string | null;
    status: UserStatus;
    description: string | null;
    username: string;
    name:string | null;
  };

export type userDetails = failedResponse | User 

export type userProfileData = {
  completedTodoCount: number;
  removedTodoCount: number;
  activeTodoCount: number;
  userName: string;
  email: string;
  gender: string;
  name: string;
  phNo: string;
  description: string;
  birthDay: string;
  city: string;
  country: string;
};