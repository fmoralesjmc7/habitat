import { HttpError } from './http-error';

export interface HttpErrorCodes {
    unauthorized: HttpError;
    internalServerError: HttpError;
    badRequest: HttpError;
}
