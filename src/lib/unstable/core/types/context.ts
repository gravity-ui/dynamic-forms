import type {SchemaRendererMode} from '../constants';

import type {SchemaRendererConfig} from './config';
import type {SetValidationCacheMutator, SetValidationWaitersMutator} from './mutators';
import type {JsonSchema} from './schema';
import type {ErrorMessages} from './validation';

export interface SchemaRendererContextType {
    config: SchemaRendererConfig;
    errorMessages: ErrorMessages;
    mode: SchemaRendererMode;
    name: string;
    schema: JsonSchema;
    tools: {
        setValidationCache: SetValidationCacheMutator;
        setValidationWaiters: SetValidationWaitersMutator;
    };
}
