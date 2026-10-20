import type {useIntegrationFF, useSearch, useSearchStore, useStore} from '../hooks';

import type {FieldRenderProps} from './field';

/** @deprecated Use the SchemaRenderer API. */
export interface ControllerMirror {
    useField?: FieldRenderProps<any>;
    useSearch?: ReturnType<typeof useSearch>;
}

/** @deprecated Use the SchemaRenderer API. */
export interface DynamicFieldMirror {
    useStore?: ReturnType<typeof useStore>;
    useIntegrationFF?: ReturnType<typeof useIntegrationFF>;
    useSearchStore?: ReturnType<typeof useSearchStore>;
}

/** @deprecated Use the SchemaRenderer API. */
export interface WonderMirror {
    field: DynamicFieldMirror;
    controller: Record<string, ControllerMirror | undefined>;
}
