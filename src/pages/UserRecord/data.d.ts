export interface LogListItem {
    id: number;
    message: string;
    userInfo: string;
    requestUrl: string;
    responseStatus: number;
    methodName: string;
    logParameters: string;
    date: string;
    audit: string;
  }
  
export interface User{
  id:number;
  firstName:string;
  email:string;
  lastName:string;
}
  