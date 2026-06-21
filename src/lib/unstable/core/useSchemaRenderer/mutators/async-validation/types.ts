import type {MutableState, Tools} from 'final-form';

import type {FieldValue, JsonSchema, SyncValidateError, Validator} from '../../../types';

export interface AsyncValidationWaiter {
    schema: JsonSchema;
    validator: Validator<JsonSchema>;
    value: FieldValue;
}

export interface AsyncValidationCache extends AsyncValidationWaiter {
    result: SyncValidateError;
}

export interface AsyncValidationState {
    cache?: {
        [key: string]: AsyncValidationCache[] | undefined;
    };
    waiters?: {
        [key: string]: AsyncValidationWaiter | undefined;
    };
}

export interface SetAsyncValidationWaitersParams {
    headName: string;
    waiters: {
        [key: string]: AsyncValidationWaiter;
    };
}

export type SetAsyncValidationWaitersFunction<
    FormValues = object,
    InitialFormValues = Partial<FormValues>,
> = (
    args: [SetAsyncValidationWaitersParams],
    state: MutableState<FormValues, InitialFormValues>,
    tools: Tools<FormValues, InitialFormValues>,
) => void;

export type SetAsyncValidationWaitersMutator = (params: SetAsyncValidationWaitersParams) => void;

export interface SetAsyncValidationCacheParams {
    cache: {
        [key: string]: AsyncValidationCache;
    };
    headName: string;
}

export type SetAsyncValidationCacheFunction<
    FormValues = object,
    InitialFormValues = Partial<FormValues>,
> = (
    args: [SetAsyncValidationCacheParams],
    state: MutableState<FormValues, InitialFormValues>,
    tools: Tools<FormValues, InitialFormValues>,
) => void;

export type SetAsyncValidationCacheMutator = (params: SetAsyncValidationCacheParams) => void;
