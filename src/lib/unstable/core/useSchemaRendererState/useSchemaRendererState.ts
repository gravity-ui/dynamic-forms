import React from 'react';

import {useForm} from 'react-final-form';

import {SchemaRendererEventType} from '../constants';
import {SCHEMA_RENDERER_SERVICE_FIELD, type SchemaRendererState} from '../useSchemaRenderer';
import {getSchemaBySchemaPath, getServiceFieldName} from '../utils';

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
    const [toggler, setToggler] = React.useState(false);

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

            const walk = (schemaPath?: string): string[] => {
                if (schemaPath) {
                    const schema = getSchemaBySchemaPath(srState.schema || {}, schemaPath);

                    return [schemaPath, ...walk(schema?.$ref)];
                }

                return [];
            };

            const schemaPaths = walk(schemaPath);

            uuidRef.current = srState.subscribe({
                name,
                schemaPaths,
                callback: () => setToggler((f) => !f),
                subscription,
            });
        }
    }, [form, name, schemaPath, srName, ...subscriptions]);

    const state: SchemaRendererState<UserContext> | undefined = React.useMemo(() => {
        const srField = form.getFieldState(srName);
        const srState: SchemaRendererState<UserContext> | undefined = srField?.data?.state;

        if (srState) {
            return {...srState, schema: {...srState.schema}};
        }

        return undefined;
    }, [form, srName, toggler]);

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
