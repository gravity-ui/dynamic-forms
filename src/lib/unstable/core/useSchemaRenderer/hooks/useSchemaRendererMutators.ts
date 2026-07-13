import {useForm} from 'react-final-form';

import type {
    RemoveAndSetSchemaMutatorsMutator,
    RemoveExternalErrorsMutator,
    RemoveSchemaMutatorsMutator,
    SetAsyncValidationCacheMutator,
    SetAsyncValidationWaitersMutator,
    SetExternalErrorsMutator,
    SetSchemaMutatorsMutator,
    TriggerFieldsMutator,
} from '../mutators';

export const useSchemaRendererMutators = () => {
    const {
        removeAndSetSchemaMutators,
        removeExternalErrors,
        removeSchemaMutators,
        setAsyncValidationCache,
        setAsyncValidationWaiters,
        setExternalErrors,
        setSchemaMutators,
        triggerFields,
    } = useForm().mutators as {
        removeAndSetSchemaMutators: RemoveAndSetSchemaMutatorsMutator | undefined;
        removeExternalErrors: RemoveExternalErrorsMutator | undefined;
        removeSchemaMutators: RemoveSchemaMutatorsMutator | undefined;
        setAsyncValidationCache: SetAsyncValidationCacheMutator | undefined;
        setAsyncValidationWaiters: SetAsyncValidationWaitersMutator | undefined;
        setExternalErrors: SetExternalErrorsMutator | undefined;
        setSchemaMutators: SetSchemaMutatorsMutator | undefined;
        triggerFields: TriggerFieldsMutator | undefined;
    };

    return {
        removeAndSetSchemaMutators,
        removeExternalErrors,
        removeSchemaMutators,
        setAsyncValidationCache,
        setAsyncValidationWaiters,
        setExternalErrors,
        setSchemaMutators,
        triggerFields,
    };
};
