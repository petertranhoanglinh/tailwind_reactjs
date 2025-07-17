import { ColorButtonKey } from "../_interfaces";

export interface CardBoxModel{
    message:string;
    buttonColor:ColorButtonKey;
    buttonLabel:string;
    isActive:boolean;
    isAction : boolean ;
    onClose : (confirmed: boolean) => void; 
}

  

export const _initCardBoxModel : CardBoxModel = {
    message : "",
    buttonColor : "info",
    isActive : false,
    buttonLabel : "Save",
    isAction : true ,
    onClose: () => {}
}