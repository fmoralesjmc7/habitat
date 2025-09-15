import { HttpErrorCodes } from '@providers/http-client/interfaces/http-error-codes';

export const httpErrorCodes: HttpErrorCodes = {
  unauthorized: {
    code: 401,
    message: 'Usuario sin autorización',
  },
  internalServerError: {
    code: 500,
    message: 'El servicio ha respondido con un error. Por favor, inténtalo de nuevo más tarde.',
  },
  badRequest: {
    code: 400,
    message: 'Bad request',
  },
};
