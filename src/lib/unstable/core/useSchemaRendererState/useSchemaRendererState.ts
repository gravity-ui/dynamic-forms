import React from 'react';

import {useForm} from 'react-final-form';

import {SchemaRendererEventType} from '../constants';
import {SCHEMA_RENDERER_SERVICE_FIELD, type SchemaRendererState} from '../useSchemaRenderer';
import {getSchemaByPointer, getServiceFieldName} from '../utils';

export interface UseSchemaRendererStateParams {
    headName: string;
    name?: string;
    schemaPath?: string;
    subscriptions?: SchemaRendererEventType[];
}

export const useSchemaRendererState = <
    UserContext extends Record<string, unknown> = Record<string, unknown>,
>({
    headName,
    name,
    schemaPath,
    subscriptions = Object.values(SchemaRendererEventType),
}: UseSchemaRendererStateParams) => {
    const form = useForm();

    const uuidRef = React.useRef<string>(null);
    const [tick, setTick] = React.useState(0);

    const srName = React.useMemo(
        () => getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, headName),
        [headName],
    );

    React.useMemo(() => {
        const srField = form.getFieldState(srName);
        const srState: SchemaRendererState | undefined = srField?.data?.state;

        if (srState) {
            if (uuidRef.current) {
                srState.unsubscribe(uuidRef.current);
            }

            const subscription = subscriptions.reduce(
                (acc: Partial<Record<SchemaRendererEventType, boolean>>, s) => ({
                    ...acc,
                    [s]: true,
                }),
                {},
            );

            const walk = (path?: string, paths: Set<string> = new Set()): string[] => {
                if (path && !paths.has(path)) {
                    paths.add(path);

                    const schema = getSchemaByPointer(srState.schema || {}, path);

                    return [path, ...walk(schema?.$ref, paths)];
                }

                return [];
            };

            const schemaPaths = walk(schemaPath);

            uuidRef.current = srState.subscribe({
                name,
                schemaPaths,
                callback: () => setTick((t) => t + 1),
                subscription,
            });
        }
    }, [form, name, schemaPath, srName, subscriptions.join(',')]);

    const state: SchemaRendererState<UserContext> | undefined = React.useMemo(() => {
        const srField = form.getFieldState(srName);
        const srState: SchemaRendererState<UserContext> | undefined = srField?.data?.state;

        if (srState) {
            return {...srState};
        }

        return undefined;
    }, [form, srName, tick]);

    React.useEffect(() => {
        return () => {
            const srField = form.getFieldState(srName);
            const srState: SchemaRendererState | undefined = srField?.data?.state;

            if (srState && uuidRef.current) {
                srState.unsubscribe(uuidRef.current);
            }
        };
    }, []);

    return state;
};
