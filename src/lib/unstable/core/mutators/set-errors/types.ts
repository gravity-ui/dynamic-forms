import type {MutableState, Tools} from 'final-form';

import type {SyncValidateError} from '../../types';

export interface ErrorsState {
    priorityErrors?: {
        [key: string]: SyncValidateError;
    };
    regularErrors?: {
        [key: string]: SyncValidateError;
    };
}

export interface SetErrorsParams {
    priorityErrors?: {
        [key: string]: SyncValidateError;
    };
    serviceFieldName: string;
    regularErrors?: {
        [key: string]: SyncValidateError;
    };
}

export type SetErrorsFunction<FormValues = object, InitialFormValues = Partial<FormValues>> = (
    args: [SetErrorsParams],
    state: MutableState<FormValues, InitialFormValues>,
    tools: Tools<FormValues, InitialFormValues>,
) => void;

export type SetErrorsMutator = (params: SetErrorsParams) => void;

export interface RemoveErrorsParams {
    removeFunctionOrNames: string[] | ((state: ErrorsState) => ErrorsState);
    serviceFieldName: string;
}

export type RemoveErrorsFunction<FormValues = object, InitialFormValues = Partial<FormValues>> = (
    args: [RemoveErrorsParams],
    state: MutableState<FormValues, InitialFormValues>,
    tools: Tools<FormValues, InitialFormValues>,
) => void;

export type RemoveErrorsMutator = (params: RemoveErrorsParams) => void;
