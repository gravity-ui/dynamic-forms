import {useForm} from 'react-final-form';

import type {
    RemoveAndSetExternalErrorsMutator,
    RemoveAndSetSchemaMutatorsMutator,
    RemoveExternalErrorsMutator,
    RemoveSchemaMutatorsMutator,
    SetAsyncValidationCacheMutator,
    SetAsyncValidationWaitersMutator,
    SetExternalErrorsMutator,
    SetSchemaMutatorsMutator,
    SetUserContextMutator,
    TriggerFieldsMutator,
} from '../mutators';

export const useSchemaRendererMutators = <
    Context extends Record<string, unknown> = Record<string, unknown>,
>() => {
    const {
        removeAndSetExternalErrors,
        removeAndSetSchemaMutators,
        removeExternalErrors,
        removeSchemaMutators,
        setAsyncValidationCache,
        setAsyncValidationWaiters,
        setExternalErrors,
        setSchemaMutators,
        setUserContext,
        triggerFields,
    } = useForm().mutators as {
        removeAndSetExternalErrors: RemoveAndSetExternalErrorsMutator | undefined;
        removeAndSetSchemaMutators: RemoveAndSetSchemaMutatorsMutator | undefined;
        removeExternalErrors: RemoveExternalErrorsMutator | undefined;
        removeSchemaMutators: RemoveSchemaMutatorsMutator | undefined;
        setAsyncValidationCache: SetAsyncValidationCacheMutator | undefined;
        setAsyncValidationWaiters: SetAsyncValidationWaitersMutator | undefined;
        setExternalErrors: SetExternalErrorsMutator | undefined;
        setSchemaMutators: SetSchemaMutatorsMutator | undefined;
        setUserContext: SetUserContextMutator<Context> | undefined;
        triggerFields: TriggerFieldsMutator | undefined;
    };

    return {
        removeAndSetExternalErrors,
        removeAndSetSchemaMutators,
        removeExternalErrors,
        removeSchemaMutators,
        setAsyncValidationCache,
        setAsyncValidationWaiters,
        setExternalErrors,
        setSchemaMutators,
        setUserContext,
        triggerFields,
    };
};
