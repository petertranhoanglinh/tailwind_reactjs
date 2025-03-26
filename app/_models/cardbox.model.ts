import { ColorButtonKey } from "../_interfaces";

export interface CardBoxModel{
    message:string;
    buttonColor:ColorButtonKey;
    buttonLabel:string;
    isActive:boolean;
    isAction : boolean ;
}

  

export const _initCardBoxModel : CardBoxModel = {
    message : "",
    buttonColor : "info",
    isActive : false,
    buttonLabel : "Save",
    isAction : true 
}