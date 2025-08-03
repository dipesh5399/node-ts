import { Types } from "mongoose";

export interface IResponseObject {
  message: string;
  result?: object | Array<any> | string;
  error?: object | string;
}

export interface validationSchema {
  params?: object;
  headers?: object;
  query?: object;
  cookies?: object;
  signedCookies?: object;
  body?: object;
}
