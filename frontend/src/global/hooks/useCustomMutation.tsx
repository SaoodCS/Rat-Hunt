/* eslint-disable unused-imports/no-unused-vars */
import type {
   MutationFunction,
   UseMutationOptions,
   UseMutationResult,
} from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';
import useApiErrorContext from '../context/widget/apiError/hooks/useApiErrorContext';
import { LoaderContext } from '../context/widget/loader/LoaderContext';
import { APIHelper } from '../firebase/apis/helper/NApiHelper';

export function useCustomMutation<TData, TVariables>(
   mutationFn: MutationFunction<TData, TVariables>,
   options?: UseMutationOptions<TData, unknown, TVariables>,
): UseMutationResult<TData, unknown, TVariables, void> {
   const { setShowLoader } = useContext(LoaderContext);
   const { setApiError } = useApiErrorContext();

   // Define the default callbacks
   const defaultOnMutate = (variables: TVariables): void => {
      console.log('Default onMutate');
      setShowLoader(true);
   };

   const defaultOnSettled = (
      data: TData | undefined,
      error: unknown,
      variables: TVariables,
      context: unknown,
   ): void => {
      console.log('Default onSettled');
      setShowLoader(false);
   };

   const defaultOnSuccess = (data: TData, variables: TVariables, context: unknown): void => {
      console.log('Default onSuccess');
   };

   const defaultOnError = (error: unknown, variables: TVariables, context: unknown): void => {
      console.log('Default onError');
      setApiError(APIHelper.handleError(error));
   };

   // Concatenate the custom callbacks with the default ones
   const combinedOnSuccess = options?.onSuccess
      ? (data: TData, variables: TVariables, context: unknown): void => {
           defaultOnSuccess?.(data, variables, context);
           options.onSuccess?.(data, variables, context);
        }
      : defaultOnSuccess;

   const combinedOnError = options?.onError
      ? (error: unknown, variables: TVariables, context: unknown): void => {
           defaultOnError?.(error, variables, context);
           options.onError?.(error, variables, context);
        }
      : defaultOnError;

   const combinedOnSettled = options?.onSettled
      ? (
           data: TData | undefined,
           error: unknown,
           variables: TVariables,
           context: unknown,
        ): void => {
           defaultOnSettled?.(data, error, variables, context);
           options.onSettled?.(data, error, variables, context);
        }
      : defaultOnSettled;

   const combinedOnMutate = options?.onMutate
      ? (variables: TVariables): void => {
           defaultOnMutate?.(variables);
           options.onMutate?.(variables);
        }
      : defaultOnMutate;

   return useMutation(mutationFn, {
      ...options,
      onSuccess: combinedOnSuccess,
      onError: combinedOnError,
      onSettled: combinedOnSettled,
      onMutate: combinedOnMutate,
   });
}
