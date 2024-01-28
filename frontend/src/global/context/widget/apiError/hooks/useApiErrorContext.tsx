import { useContext } from 'react';
import type { IApiErrorContext } from '../apiErrorContext';
import { ApiErrorContext } from '../apiErrorContext';

export default function useApiErrorContext(): IApiErrorContext {
   const { apiError, setApiError } = useContext(ApiErrorContext);
   return { apiError, setApiError };
}
