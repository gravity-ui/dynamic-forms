import type {MutableState, Tools} from 'final-form';

export interface ErrorsState {
    priorityErrors?: {
        [key: string]: string | undefined;
    };
    regularErrors?: {
        [key: string]: string | undefined;
    };
}

export interface SetErrorsParams {
    priorityErrors?: {
        [key: string]: string | undefined;
    };
    serviceFieldName: string;
    regularErrors?: {
        [key: string]: string | undefined;
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
