import {useForm} from 'react-final-form';

import type {
    RemoveExternalErrorsMutator,
    RemoveSchemaMutatorsMutator,
    SetArrayObjectErrorsMutator,
    SetAsyncValidationCacheMutator,
    SetAsyncValidationWaitersMutator,
    SetExternalErrorsMutator,
    SetSchemaMutatorsMutator,
} from '../mutators';

export const useSchemaRendererMutators = () => {
    const {
        removeExternalErrors,
        removeSchemaMutators,
        setArrayObjectErrors,
        setAsyncValidationCache,
        setAsyncValidationWaiters,
        setExternalErrors,
        setSchemaMutators,
    } = useForm().mutators as {
        removeExternalErrors: RemoveExternalErrorsMutator | undefined;
        removeSchemaMutators: RemoveSchemaMutatorsMutator | undefined;
        setArrayObjectErrors: SetArrayObjectErrorsMutator | undefined;
        setAsyncValidationCache: SetAsyncValidationCacheMutator | undefined;
        setAsyncValidationWaiters: SetAsyncValidationWaitersMutator | undefined;
        setExternalErrors: SetExternalErrorsMutator | undefined;
        setSchemaMutators: SetSchemaMutatorsMutator | undefined;
    };

    return {
        removeExternalErrors,
        removeSchemaMutators,
        setArrayObjectErrors,
        setAsyncValidationCache,
        setAsyncValidationWaiters,
        setExternalErrors,
        setSchemaMutators,
    };
};
