
 export class CustomAPIError extends Error {
    static BadRequestError: any;
    static UnauthenticatedError: any;
  static UnauthorisedError: any;
    constructor(message:string) {
      super(message)
    }
  }
  
  