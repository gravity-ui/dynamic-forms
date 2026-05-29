import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import merge from 'lodash/merge';
import set from 'lodash/set';

import {getSchemaPath} from '../../utils';

import type {
    RemoveSchemaMutatorsFunction,
    SchemaMutatorsState,
    SetSchemaMutatorsFunction,
} from './types';

export const setSchemaMutators: SetSchemaMutatorsFunction = (
    [{headName, mutators: mutatorsParams}],
    mutableState,
) => {
    const field = mutableState.fields[headName];
    const data = field?.data as SchemaMutatorsState | undefined;

    if (field && data?.schema && Object.keys(mutatorsParams).length) {
        const mutatedSchema = {...data.schema};
        const mutators = [...(data.mutators || []), ...mutatorsParams];

        mutatorsParams.forEach(({name, schema}) => {
            const schemaPath = getSchemaPath(name, headName, mutatedSchema);

            if (schemaPath) {
                set(mutatedSchema, schemaPath, merge({...get(mutatedSchema, schemaPath)}, schema));

                const schemaField = mutableState.fields[name];

                if (schemaField) {
                    schemaField.data = {
                        ...schemaField.data,
                        schema: get(mutatedSchema, schemaPath),
                    };
                }
            }
        });

        field.data = {
            ...field.data,
            mutators,
            schema: mutatedSchema,
        };
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
        const mutatedSchema = {...data.schema};
        const mutators = (data.mutators || []).filter((m) => {
            if (
                mutatorsToRemove.some(
                    ({name, schema}) =>
                        name === m.name && (isEqual(m.schema, schema) || schema === true),
                )
            ) {
                return false;
            }

            return true;
        });

        mutatorsToRemove.forEach(({name}) => {
            const schemaPath = getSchemaPath(name, headName, originalSchema);

            if (schemaPath) {
                set(mutatedSchema, schemaPath, cloneDeep(get(originalSchema, schemaPath)));

                const schemaField = mutableState.fields[name];

                if (schemaField) {
                    schemaField.data = {
                        ...schemaField.data,
                        schema: get(mutatedSchema, schemaPath),
                    };
                }
            }
        });

        mutators.forEach(({name, schema}) => {
            const schemaPath = getSchemaPath(name, headName, mutatedSchema);

            if (schemaPath) {
                set(mutatedSchema, schemaPath, merge({...get(mutatedSchema, schemaPath)}, schema));

                const schemaField = mutableState.fields[name];

                if (schemaField) {
                    schemaField.data = {
                        ...schemaField.data,
                        schema: get(mutatedSchema, schemaPath),
                    };
                }
            }
        });

        field.data = {
            ...field.data,
            mutators,
            schema: mutatedSchema,
        };
    }
};
