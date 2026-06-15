import {useForm} from 'react-final-form';

import type {
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
        removeExternalErrors,
        removeSchemaMutators,
        setAsyncValidationCache,
        setAsyncValidationWaiters,
        setExternalErrors,
        setSchemaMutators,
        triggerFields,
    } = useForm().mutators as {
        removeExternalErrors: RemoveExternalErrorsMutator | undefined;
        removeSchemaMutators: RemoveSchemaMutatorsMutator | undefined;
        setAsyncValidationCache: SetAsyncValidationCacheMutator | undefined;
        setAsyncValidationWaiters: SetAsyncValidationWaitersMutator | undefined;
        setExternalErrors: SetExternalErrorsMutator | undefined;
        setSchemaMutators: SetSchemaMutatorsMutator | undefined;
        triggerFields: TriggerFieldsMutator | undefined;
    };

    return {
        removeExternalErrors,
        removeSchemaMutators,
        setAsyncValidationCache,
        setAsyncValidationWaiters,
        setExternalErrors,
        setSchemaMutators,
        triggerFields,
    };
};
