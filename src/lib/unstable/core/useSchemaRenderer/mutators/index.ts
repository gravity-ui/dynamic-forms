import {setArrayObjectErrors} from './array-object-errors';
import {setAsyncValidationCache, setAsyncValidationWaiters} from './async-validation';
import {removeExternalErrors, setExternalErrors} from './external-errors';
import {removeSchemaMutators, setSchemaMutators} from './schema-mutators';

export type * from './array-object-errors';
export type * from './async-validation';
export type * from './external-errors';
export type * from './schema-mutators';

export const schemaRendererMutators = {
    removeExternalErrors,
    removeSchemaMutators,
    setArrayObjectErrors,
    setAsyncValidationCache,
    setAsyncValidationWaiters,
    setExternalErrors,
    setSchemaMutators,
};
