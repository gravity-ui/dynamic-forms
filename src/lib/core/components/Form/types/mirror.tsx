import {useIntegrationFF, useSearch, useSearchStore, useStore} from '../hooks';

import {FieldRenderProps} from './field';

export interface ControllerMirror {
    useField?: FieldRenderProps<any>;
    useSearch?: ReturnType<typeof useSearch>;
}

export interface DynamicFieldMirror {
    useStore?: ReturnType<typeof useStore>;
    useIntegrationFF?: ReturnType<typeof useIntegrationFF>;
    useSearchStore?: ReturnType<typeof useSearchStore>;
}

export interface WonderMirror {
    field: DynamicFieldMirror;
    controller: Record<string, ControllerMirror | undefined>;
}
