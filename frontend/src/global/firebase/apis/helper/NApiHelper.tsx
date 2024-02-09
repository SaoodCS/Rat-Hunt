import { FirebaseError } from 'firebase/app';

export namespace APIHelper {
   export interface IErrorRes {
      error: string;
   }

   export interface ISuccessMsgRes {
      message: string;
   }

   export class ErrorThrower extends Error {
      constructor(error: string) {
         super(error);
         Object.defineProperty(this, 'error', {
            enumerable: true,
            value: error,
         });
      }
   }

   export function createBody<T>(formValues: T): BodyInit {
      return JSON.stringify(formValues);
   }

   export function isSuccessMsgRes(response: unknown): response is ISuccessMsgRes {
      return typeof response === 'object' && response !== null && 'message' in response;
   }

   export function isErrorRes(response: unknown): response is IErrorRes {
      return (
         typeof response === 'object' &&
         response !== null &&
         'error' in response &&
         typeof (response as IErrorRes).error === 'string'
      );
   }

   export function isFirebaseError(error: unknown): error is FirebaseError {
      return error instanceof FirebaseError;
   }

   export function handleError(error: unknown): string {
      if (isFirebaseError(error)) {
         const errorMsgs: { [key: string]: string } = {
            'auth/wrong-password': 'Incorrect password',
            'auth/email-already-exists': 'User with this email already exists',
            'auth/invalid-login-credentials': 'Incorrect email or password',
            'auth/invalid-password': 'Password must have at least 6 characters',
            'auth/user-not-found': 'User with this email does not exist',
            'auth/user-disabled': 'The user account has been disabled.',
            'auth/user-mismatch': 'Your current email is incorrect.',
            'auth/invalid-email': 'Your new email must be a valid email address',
            'auth/weak-password': 'Your password should be at least 6 characters long',
            'auth/too-many-requests': 'Too many requests. Try again later.',
         };
         return errorMsgs[error.code] || error.message;
      }

      if (isErrorRes(error)) return error.error;

      if (typeof error === 'string') return error;

      if (error === null) {
         return 'Unknown Error: null';
      }

      return 'Unknown Error';
   }

   export async function fetcher<T>(
      body: BodyInit | null | undefined,
      method: string,
      endpointURL: string,
   ): Promise<T> {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      const fetchParams = body ? { method, body, headers } : { method, headers };
      try {
         const response = await fetch(endpointURL, fetchParams);
         const data = await response.json();
         if (!response.ok) {
            throw new ErrorThrower(data.error);
         }
         return data as T;
      } catch (error) {
         throw new ErrorThrower(APIHelper.handleError(error));
      }
   }
}

export default APIHelper;
