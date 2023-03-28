import {
    useComponents,
    useField,
    useIntegrationFF,
    useRender,
    useSearch,
    useSearchStore,
    useStore,
    useValidate,
} from '../hooks';

export interface ControllerMirror {
    useComponents?: ReturnType<typeof useComponents>;
    useRender?: ReturnType<typeof useRender>;
    useValidate?: ReturnType<typeof useValidate>;
    useField?: ReturnType<typeof useField>;
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
