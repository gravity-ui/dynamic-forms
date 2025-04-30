import type {RemoveErrorsParams, SetErrorsParams} from '../mutators';

export type SetErrors = (params: Omit<SetErrorsParams, 'serviceFieldName'>) => void;

export type RemoveErrors = (params: Omit<RemoveErrorsParams, 'serviceFieldName'>) => void;

export interface UseSetErrorsReturn {
    removeErrors: RemoveErrors;
    setErrors: SetErrors;
}
