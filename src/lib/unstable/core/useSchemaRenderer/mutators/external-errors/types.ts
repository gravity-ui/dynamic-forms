import type {MutableState, Tools} from 'final-form';

import type {SyncValidateError} from '../../../types';

export interface ExternalErrorsState {
    priorityErrors?: {
        [key: string]: SyncValidateError;
    };
    regularErrors?: {
        [key: string]: SyncValidateError;
    };
}

export interface SetExternalErrorsParams {
    headName: string;
    priorityErrors?: {
        [key: string]: SyncValidateError;
    };
    regularErrors?: {
        [key: string]: SyncValidateError;
    };
}

export type SetExternalErrorsFunction<
    FormValues = object,
    InitialFormValues = Partial<FormValues>,
> = (
    args: [SetExternalErrorsParams],
    state: MutableState<FormValues, InitialFormValues>,
    tools: Tools<FormValues, InitialFormValues>,
) => void;

export type SetExternalErrorsMutator = (params: SetExternalErrorsParams) => void;

export interface RemoveExternalErrorsParams {
    headName: string;
    removeFunctionOrNames: string[] | ((state: ExternalErrorsState) => ExternalErrorsState);
}

export type RemoveExternalErrorsFunction<
    FormValues = object,
    InitialFormValues = Partial<FormValues>,
> = (
    args: [RemoveExternalErrorsParams],
    state: MutableState<FormValues, InitialFormValues>,
    tools: Tools<FormValues, InitialFormValues>,
) => void;

export type RemoveExternalErrorsMutator = (params: RemoveExternalErrorsParams) => void;
