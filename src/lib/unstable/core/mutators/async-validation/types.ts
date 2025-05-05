import type {MutableState, Tools} from 'final-form';

import type {FieldValue, JsonSchema, SyncValidateError, Validator} from '../../types';

export interface ValidationWaiter {
    schema: JsonSchema;
    validator: Validator<JsonSchema>;
    value: FieldValue | null | undefined;
}

export interface ValidationCache extends ValidationWaiter {
    result: SyncValidateError;
}

export interface ValidationState {
    cache?: {
        [key: string]: ValidationCache[] | undefined;
    };
    waiters?: {
        [key: string]: ValidationWaiter | undefined;
    };
}

export interface SetValidationWaitersParams {
    serviceFieldName: string;
    waiters: {
        [key: string]: ValidationWaiter;
    };
}

export type SetValidationWaitersFunction<
    FormValues = object,
    InitialFormValues = Partial<FormValues>,
> = (
    args: [SetValidationWaitersParams],
    state: MutableState<FormValues, InitialFormValues>,
    tools: Tools<FormValues, InitialFormValues>,
) => void;

export type SetValidationWaitersMutator = (params: SetValidationWaitersParams) => void;

export interface SetValidationCacheParams {
    cache: {
        [key: string]: ValidationCache;
    };
    serviceFieldName: string;
}

export type SetValidationCacheFunction<
    FormValues = object,
    InitialFormValues = Partial<FormValues>,
> = (
    args: [SetValidationCacheParams],
    state: MutableState<FormValues, InitialFormValues>,
    tools: Tools<FormValues, InitialFormValues>,
) => void;

export type SetValidationCacheMutator = (params: SetValidationCacheParams) => void;
