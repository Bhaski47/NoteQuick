import { userProfileData } from "@/types";
import axios from "axios";

export async function getUserProfile(userName : string):Promise<userProfileData|null >{
    const res = await axios.get(`${process.env.host}/user/${userName}`)
    if(res.data.userName === null){
        return null;
    }
    return res.data.data as userProfileData;
}