import { userProfileData } from "./user";

export type Props = {
  data: userProfileData;
};

export type navCardProps = {
    name:string,
    valueClassStyle?:string,
    wrapperClassStyle?:string,
    values:number,
    titleClassStyle?:string
}

export type infoCardType = {
    title:string,
    name:string
}