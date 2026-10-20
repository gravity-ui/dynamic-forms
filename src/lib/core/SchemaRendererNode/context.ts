import React from 'react';

import type {FieldRenderProps} from 'react-final-form';

import type {SchemaRendererMode} from '../constants';
import type {FieldValue, JsonSchema} from '../types';
import type {SchemaRendererSettings} from '../useSchemaRenderer';

export interface SchemaRendererNodeContextValue extends FieldRenderProps<FieldValue> {
    headName: string;
    mode: SchemaRendererMode;
    name: string;
    parentValueEmpty: boolean;
    schema: JsonSchema;
    schemaPath: string;
    settings?: SchemaRendererSettings;
}

export interface SchemaRendererNodeContextRuler {
    getSnapshot: () => SchemaRendererNodeContextValue;
    notify: () => void;
    set: (value: SchemaRendererNodeContextValue) => void;
    subscribe: (listener: () => void) => () => void;
}

export const createSchemaRendererNodeContextRuler = (
    initialValue: SchemaRendererNodeContextValue,
): SchemaRendererNodeContextRuler => {
    let value = initialValue;
    const listeners = new Set<() => void>();

    return {
        getSnapshot: () => value,
        notify: () => {
            listeners.forEach((listener) => listener());
        },
        set: (nextValue) => {
            value = nextValue;
        },
        subscribe: (listener) => {
            listeners.add(listener);

            return () => {
                listeners.delete(listener);
            };
        },
    };
};

export const SchemaRendererNodeContext = React.createContext<SchemaRendererNodeContextRuler>(
    null as unknown as SchemaRendererNodeContextRuler,
);

export const useSchemaRendererNodeContext = (): SchemaRendererNodeContextValue => {
    const store = React.useContext(SchemaRendererNodeContext);

    const value = store.getSnapshot();
    const [, forceRender] = React.useReducer((x: number) => x + 1, 0);
    const valueRef = React.useRef(value);

    valueRef.current = value;

    React.useLayoutEffect(() => {
        const check = () => {
            if (store.getSnapshot() !== valueRef.current) {
                forceRender();
            }
        };
        const unsubscribe = store.subscribe(check);

        check();

        return unsubscribe;
    }, [store]);

    return value;
};
