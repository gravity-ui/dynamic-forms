import type {MonacoEditorProps} from 'react-monaco-editor/lib/types';

import type {SchemaRendererMode} from '../../constants';
import type {ErrorMessages, JsonSchema, NodesConfig, ValidationError} from '../../types';

import type {SchemaPatch} from './patches';
import type {SchemaRendererEvent, SchemaRendererSubscriber} from './subscription';
import type {ValidationCache, ValidationWaiter} from './validation';

export interface SchemaRendererState<
    UserContext extends Record<string, unknown> = Record<string, unknown>,
> {
    cache: Record<string, ValidationCache[] | undefined>;
    config: NodesConfig;
    dispatchEvent: (events: SchemaRendererEvent[]) => void;
    errors: Record<string, ValidationError>;
    errorMessages: ErrorMessages;
    mode: SchemaRendererMode;
    originalSchema: JsonSchema;
    patches: SchemaPatch[];
    priorityErrors: Record<string, ValidationError>;
    regularErrors: Record<string, ValidationError>;
    runValidate: () => void;
    schema: JsonSchema;
    subscribe: (subscriber: SchemaRendererSubscriber) => string;
    subscribers: {
        byId: Record<string, SchemaRendererSubscriber>;
        byName: Map<string, Set<string>>;
        byPath: Map<string, Set<string>>;
    };
    unsubscribe: (id: string) => void;
    userContext: {MonacoEditor?: React.ComponentType<MonacoEditorProps>} & UserContext;
    waiters: Record<string, ValidationWaiter | undefined>;
}
