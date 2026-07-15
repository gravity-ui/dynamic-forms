import type {MutableState} from 'final-form';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import set from 'lodash/set';

import type {EntityState} from '../../../Entity';
import {getSchemaPath, getValuePaths, parseSchemaPath, smartSet} from '../../../utils';
import {guessHeadName} from '../../utils';

import type {
    RemoveAndSetSchemaMutatorsFunction,
    RemoveSchemaMutatorsFunction,
    SchemaMutatorsState,
    SetSchemaMutatorsFunction,
    SetSchemaMutatorsParams,
} from './types';

const applyMutators = ({
    mutableState,
    mutators,
    replace = false,
}: {
    mutableState: MutableState<object, object>;
    mutators: SetSchemaMutatorsParams['mutators'];
    replace?: boolean;
}) => {
    const registeredFields = Object.keys(mutableState.fields);

    mutators.forEach((m) => {
        const headName = guessHeadName(registeredFields, m.name);

        if (headName) {
            const headField = mutableState.fields[headName];
            const data = headField?.data as SchemaMutatorsState | undefined;
            const mutatedSchema = data?.schema;

            if (mutatedSchema) {
                const schemaPath = getSchemaPath(m.name, headName, mutatedSchema);

                if (schemaPath) {
                    if (replace) {
                        set(mutatedSchema, schemaPath, m.schema);
                    } else {
                        smartSet(mutatedSchema, schemaPath, m.schema);
                    }

                    const schemaField = mutableState.fields[m.name];

                    if (schemaField) {
                        schemaField.data = {
                            ...schemaField.data,
                            schema: get(mutatedSchema, schemaPath),
                        };
                    }

                    headField.data.mutators = [...(data?.mutators || []), m];
                    headField.data.schema = mutatedSchema;

                    const mutatedPaths = getValuePaths(m.schema).map((path) => [
                        ...schemaPath,
                        ...path,
                    ]);

                    Object.values(mutableState.fields).forEach((field) => {
                        const data = field?.data as EntityState | undefined;

                        if (data?.schema?.$ref && data?.headName === headName) {
                            const refPath = parseSchemaPath(data.schema.$ref);
                            const mutationAffectRefSchema = mutatedPaths.some((mutatedPath) =>
                                refPath.every((subpath, index) => mutatedPath[index] === subpath),
                            );
                            const fieldSchemaPath = getSchemaPath(
                                field.name,
                                headName,
                                mutatedSchema,
                            );

                            if (mutationAffectRefSchema && fieldSchemaPath) {
                                field.data = {
                                    ...field.data,
                                    schema: {...get(mutatedSchema, fieldSchemaPath)},
                                };
                            }
                        }
                    });
                }
            }
        }
    });
};

export const setSchemaMutators: SetSchemaMutatorsFunction = ([{mutators}], mutableState) => {
    applyMutators({mutableState, mutators});
};

export const removeSchemaMutators: RemoveSchemaMutatorsFunction = (
    [{mutatorsToRemove}],
    mutableState,
) => {
    const registeredFields = Object.keys(mutableState.fields);

    [...new Set(mutatorsToRemove.map((m) => guessHeadName(registeredFields, m.name)))].forEach(
        (name) => {
            if (name) {
                const headField = mutableState.fields[name];
                const data = headField?.data as SchemaMutatorsState | undefined;
                const originalSchema = data?.originalSchema;
                const mutators = data?.mutators || [];

                if (headField && originalSchema) {
                    applyMutators({
                        mutableState,
                        mutators: mutators.map((m) => {
                            const schemaPath = getSchemaPath(m.name, name, originalSchema);

                            return {
                                ...m,
                                schema: schemaPath
                                    ? cloneDeep(get(originalSchema, schemaPath))
                                    : {},
                            };
                        }),
                        replace: true,
                    });

                    headField.data.mutators = [];

                    applyMutators({
                        mutableState,
                        mutators: mutators.filter(
                            (m) =>
                                !mutatorsToRemove.some(
                                    ({name, schema}) =>
                                        name === m.name &&
                                        (isEqual(m.schema, schema) || schema === true),
                                ),
                        ),
                    });
                }
            }
        },
    );
};

export const removeAndSetSchemaMutators: RemoveAndSetSchemaMutatorsFunction = (...args) => {
    removeSchemaMutators(...args);
    setSchemaMutators(...args);
};
