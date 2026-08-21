import type {FormApi} from 'final-form';
import type {SchemaNode} from 'json-schema-library';
import get from 'lodash/get';
import isObjectLike from 'lodash/isObjectLike';

import {SchemaRendererEventType} from '../../constants';
import type {JSLErrors, JsonSchema, NodesConfig, ValidationError} from '../../types';
import {
    arrayPathToDotBracket,
    dotBracketToArrayPath,
    getServiceFieldName,
    getValuePaths,
} from '../../utils';
import {SCHEMA_RENDERER_SERVICE_FIELD} from '../constants';
import type {SchemaRendererState, ValidationWaiter} from '../types';

import {getSchemaRootNode} from './get-schema-root-node';
import {getParser} from './parse-errors';

export const getValidate = (form: FormApi, headName: string) => {
    let config: NodesConfig;
    let schema: JsonSchema;
    let schemaNode: SchemaNode;

    return (): ValidationError | Promise<ValidationError> => {
        const allValues = form.getState().values;
        const value = headName ? get(allValues, headName) : allValues;
        const srName = getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, headName);
        const srField = form.getFieldState(srName);
        const srState: SchemaRendererState | undefined = srField?.data?.state;

        if (!srState) {
            return false;
        }

        if (srState.schema !== schema || srState.config !== config) {
            config = srState.config;
            schema = srState.schema;
            schemaNode = getSchemaRootNode({config, schema});
        }

        const validateErrors = schemaNode.validate(value).errors as JSLErrors.Error[];

        const waiters: Record<string, ValidationWaiter> = {};
        const jslErrors: Record<string, ValidationError> = {};
        const npErrors: Record<string, ValidationError> = {};

        validateErrors.forEach((error) => {
            const parser = getParser(error.code);

            parser({
                allValues,
                error,
                form,
                headName,
                setJSLError: (n, e) => {
                    jslErrors[n] = e;
                },
                setNPError: (n, e) => {
                    npErrors[n] = e;
                },
                setWaiter: (n, w) => {
                    waiters[n] = w;
                },
                state: srState,
            });
        });

        const allErrors: Record<string, ValidationError> = {};

        Object.entries({
            ...srState?.regularErrors,
            ...jslErrors,
            ...npErrors,
            ...srState?.priorityErrors,
        }).forEach(([n, e]) => {
            if (isObjectLike(e)) {
                getValuePaths(e).forEach((childArrPath) => {
                    const childName = arrayPathToDotBracket([
                        ...dotBracketToArrayPath(n),
                        ...childArrPath,
                    ]);

                    allErrors[childName] = get(e, childArrPath);
                });
            } else {
                allErrors[n] = e;
            }
        });

        const newErrors: Record<string, ValidationError> = {};

        Object.keys({...srState.errors, ...allErrors}).forEach((key) => {
            if (srState.errors[key] !== allErrors[key]) {
                newErrors[key] = allErrors[key];
            }
        });

        srState.errors = allErrors;
        srState.waiters = {...srState.waiters, ...waiters};

        if (Object.values(newErrors).length) {
            srState.dispatchEvent([
                {type: SchemaRendererEventType.Error, names: Object.keys(newErrors)},
            ]);
        }

        if (Object.values(waiters).length) {
            return Promise.race(Object.values(waiters).map((w) => w.promise)).then(() =>
                Object.values(allErrors).some(Boolean) ? 'error' : false,
            );
        }

        return Object.values(allErrors).some(Boolean) ? 'error' : false;
    };
};
