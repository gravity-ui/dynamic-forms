import type {MutableState} from 'final-form';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';

import type {JsonSchema} from '../../../types';
import {getSchemaPath, getValuePaths, parseSchemaPath, smartSet} from '../../../utils';

import type {
    RemoveSchemaMutatorsFunction,
    SchemaMutatorsState,
    SetSchemaMutatorsFunction,
    SetSchemaMutatorsParams,
} from './types';

const applyMutators = ({
    headName,
    mutableState,
    mutators,
    rootSchema,
}: {
    headName: string;
    mutableState: MutableState<object, object>;
    mutators: SetSchemaMutatorsParams['mutators'];
    rootSchema: JsonSchema;
}) => {
    mutators.forEach(({name, schema}) => {
        const schemaPath = getSchemaPath(name, headName, rootSchema);

        if (schemaPath) {
            smartSet(rootSchema, schemaPath, schema);

            const schemaField = mutableState.fields[name];

            if (schemaField) {
                schemaField.data = {
                    ...schemaField.data,
                    schema: get(rootSchema, schemaPath),
                };
            }

            const mutatedPaths = getValuePaths(schema).map((path) => [...schemaPath, ...path]);

            Object.values(mutableState.fields).forEach((field) => {
                const data = field?.data as SchemaMutatorsState | undefined;

                if (data?.schema?.$ref) {
                    const refPath = parseSchemaPath(data.schema.$ref);
                    const mutationAffectRefSchema = mutatedPaths.some((mutatedPath) =>
                        refPath.every((subpath, index) => mutatedPath[index] === subpath),
                    );
                    const fieldSchemaPath = getSchemaPath(field.name, headName, rootSchema);

                    if (mutationAffectRefSchema && fieldSchemaPath) {
                        field.data = {
                            ...field.data,
                            schema: {...get(rootSchema, fieldSchemaPath)},
                        };
                    }
                }
            });
        }
    });
};

export const setSchemaMutators: SetSchemaMutatorsFunction = (
    [{headName, mutators: mutatorsParams}],
    mutableState,
) => {
    const field = mutableState.fields[headName];
    const data = field?.data as SchemaMutatorsState | undefined;

    if (field && data?.schema && Object.keys(mutatorsParams).length) {
        // const mutatedSchema = {...data.schema}; // ? TODO: check if this is needed
        const mutatedSchema = data.schema;
        const mutators = [...(data.mutators || []), ...mutatorsParams];

        applyMutators({headName, mutableState, mutators, rootSchema: mutatedSchema});

        // field.data = {
        //     ...field.data,
        //     mutators,
        //     schema: mutatedSchema,
        // }; ? TODO: check if this is needed
        field.data.mutators = mutators;
        field.data.schema = mutatedSchema;
    }
};

export const removeSchemaMutators: RemoveSchemaMutatorsFunction = (
    [{headName, mutatorsToRemove}],
    mutableState,
) => {
    const field = mutableState.fields[headName];
    const data = field?.data as SchemaMutatorsState | undefined;

    if (
        field &&
        data?.schema &&
        data?.originalSchema &&
        data.mutators &&
        Object.keys(mutatorsToRemove).length
    ) {
        const originalSchema = data.originalSchema;
        // const mutatedSchema = {...data.schema}; // ? TODO: check if this is needed
        const mutatedSchema = data.schema;
        const mutators = (data.mutators || []).filter(
            (m) =>
                !mutatorsToRemove.some(
                    ({name, schema}) =>
                        name === m.name && (isEqual(m.schema, schema) || schema === true),
                ),
        );

        applyMutators({
            headName,
            mutableState,
            mutators: mutatorsToRemove.map((m) => {
                const schemaPath = getSchemaPath(m.name, headName, originalSchema);

                return {...m, schema: schemaPath ? cloneDeep(get(originalSchema, schemaPath)) : {}};
            }),
            rootSchema: mutatedSchema,
        });
        applyMutators({headName, mutableState, mutators, rootSchema: mutatedSchema});

        // field.data = {
        //     ...field.data,
        //     mutators,
        //     schema: mutatedSchema,
        // }; ? TODO: check if this is needed
        field.data.mutators = mutators;
        field.data.schema = mutatedSchema;
    }
};
