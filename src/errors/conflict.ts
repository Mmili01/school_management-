import { StatusCodes } from "http-status-codes";
import {CustomAPIError} from  "./custom-api"

export class Conflict extends CustomAPIError{
    public statusCode : StatusCodes
    constructor (message:string){
        super(message)
        this.statusCode = StatusCodes.CONFLICT
    }
}
