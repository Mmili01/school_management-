import { StatusCodes } from "http-status-codes";
import  {CustomAPIError }from "./custom-api";

 export class UnauthenticatedError extends CustomAPIError{
    public statusCodes : StatusCodes

    constructor(message:string){
        super(message)
        this.statusCodes= StatusCodes.UNAUTHORIZED
    }

}

