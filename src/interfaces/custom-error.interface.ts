import { ErrorCodeEnum } from "../enums/error-code.enum.ts";

export interface CustomError {
  code: ErrorCodeEnum;
  message: string;
}
