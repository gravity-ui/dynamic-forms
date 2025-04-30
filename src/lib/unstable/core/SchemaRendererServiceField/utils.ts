import type {ErrorObject, FuncKeywordDefinition, SchemaValidateFunction} from 'ajv';
import Ajv from 'ajv';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import isString from 'lodash/isString';
import mapValues from 'lodash/mapValues';
import omit from 'lodash/omit';
import set from 'lodash/set';

import {ARRAY_AND_OBJECT_ERRORS, EMPTY_OBJECT, JsonSchemaType, OBJECT_ERROR} from '../constants';
import type {ErrorsState, ValidationState, ValidationWaiter} from '../mutators';
import type {FieldValue, JsonSchema, ObjectValue, SyncValidateError, Validator} from '../types';
import {getSchemaByFinalFormPath, parseFinalFormPath} from '../utils';

import type {
    EntityParametersError,
    GetAjvErrorMessageParams,
    GetAjvValidateParams,
    GetAjvValidateReturn,
    GetValidateParams,
    GetValidateReturn,
} from './types';

export const getAjvValidate = ({
    config,
    mainSchema,
}: GetAjvValidateParams): GetAjvValidateReturn => {
    function entityParametersValidate(_: any, value: FieldValue, schema?: JsonSchema) {
        if (schema) {
            const validatorType: string | undefined = get(schema, 'entityParameters.validatorType');
            const validator: Validator<JsonSchema> | undefined = get(
                config,
                `${schema.type}.validators.${validatorType}`,
            );

            if (validator) {
                const error: Partial<EntityParametersError> = {
                    keyword: 'entityParameters',
                    message: '',
                    params: {validator, value, schema},
                };

                (entityParametersValidate as SchemaValidateFunction).errors = [error];

                return false;
            }
        }

        return true;
    }

    const ajv = new Ajv({
        allErrors: true,
        allowMatchingProperties: true,
        keywords: [
            {
                errors: true,
                keyword: 'entityParameters',
                validate: entityParametersValidate as FuncKeywordDefinition['validate'],
            },
        ],
    });
    const ajvValidate = ajv.compile(mainSchema) as GetAjvValidateReturn;

    return ajvValidate;
};

const parseSchemaPath = (schemaPath: string): string[] => {
    return decodeURIComponent(schemaPath)
        .slice('#/'.length)
        .split('/')
        .map((segment) => segment.replace(/~1/g, '/').replace(/~0/g, '~'))
        .slice(0, -1);
};

const parseInstancePath = (instancePath: string): string[] => {
    if (!instancePath.length) {
        return [];
    }

    return instancePath
        .slice('/'.length)
        .split('/')
        .map((segment) => segment.replace(/~1/g, '/').replace(/~0/g, '~'));
};

const getSchemaBySchemaPath = (
    schemaPath: string,
    mainSchema: JsonSchema,
): JsonSchema | undefined => {
    const pathArr = parseSchemaPath(schemaPath);

    if (!pathArr.length) {
        return mainSchema;
    }

    return get(mainSchema, pathArr);
};

const getSchemaByInstancePath = (
    instancePath: string,
    mainSchema: JsonSchema,
): JsonSchema | undefined => {
    if (instancePath.length) {
        return parseInstancePath(instancePath).reduce((acc: JsonSchema | undefined, segment) => {
            const type = get(acc, 'type');

            if (type === JsonSchemaType.Object) {
                return get(acc, `properties.${segment}`);
            } else if (type === JsonSchemaType.Array) {
                const items = get(acc, 'items');

                if (Array.isArray(items)) {
                    return get(items, `[${segment}]`);
                }

                return items;
            }

            return undefined;
        }, mainSchema);
    }

    return mainSchema;
};

const getAjvErrorMessage = ({
    ajvErrorMessage,
    errorMessages = EMPTY_OBJECT,
    instancePath,
    keyword,
    mainSchema,
    schemaPath,
}: GetAjvErrorMessageParams): SyncValidateError => {
    const propertyName = instancePath.split('/').pop() as string;

    const getErrorMessageBySchema = (schema: JsonSchema | undefined) => {
        const errorOrMap: Record<string, string> | string | undefined = get(
            schema,
            `entityParameters.errorMessages.${keyword}`,
        );
        const message: string | undefined = isString(errorOrMap)
            ? errorOrMap
            : get(errorOrMap, propertyName);

        return message;
    };

    return (
        getErrorMessageBySchema(getSchemaBySchemaPath(schemaPath, mainSchema)) ||
        getErrorMessageBySchema(getSchemaByInstancePath(instancePath, mainSchema)) ||
        errorMessages[keyword as keyof typeof errorMessages] ||
        ajvErrorMessage
    );
};

export const getValidate = <Schema extends JsonSchema>({
    config,
    errorMessages,
    headName,
    mainSchema,
    serviceFieldName,
    setValidationCache,
    setValidationWaiters,
}: GetValidateParams<Schema>): GetValidateReturn<Schema> => {
    const ajvValidate = getAjvValidate({config, mainSchema});

    return (_value, allValues, meta) => {
        ajvValidate(get(allValues, headName));

        if (!ajvValidate.errors?.length) {
            return false;
        }

        const result = {[ARRAY_AND_OBJECT_ERRORS]: {}};

        const waiters: Record<string, ValidationWaiter> = {};
        const ajvErrors: {path: string[]; error: SyncValidateError}[] = [];
        const entityParametersErrors: {path: string[]; error: SyncValidateError}[] = [];

        ajvValidate.errors.forEach((ajvOrEntityParametersError) => {
            if (ajvOrEntityParametersError.keyword === 'entityParameters') {
                const entityParametersError = ajvOrEntityParametersError as EntityParametersError;
                const validationState: ValidationState | undefined = meta?.data;

                const waiter = validationState?.waiters?.[entityParametersError.instancePath];
                const cache = validationState?.cache?.[entityParametersError.instancePath];
                const cacheItem = cache?.find((item) =>
                    isEqual(entityParametersError.params, omit(item, 'result')),
                );

                if (cacheItem?.result) {
                    entityParametersErrors.push({
                        path: [
                            ...parseFinalFormPath(headName),
                            ...parseInstancePath(entityParametersError.instancePath),
                        ],
                        error: cacheItem.result,
                    });
                } else if (!waiter || !isEqual(entityParametersError.params, waiter)) {
                    const errorOrPromise = entityParametersError.params.validator(
                        entityParametersError.params.value,
                        allValues as ObjectValue,
                    );

                    if (errorOrPromise instanceof Promise) {
                        waiters[entityParametersError.instancePath] = entityParametersError.params;

                        errorOrPromise.then((result) => {
                            setValidationCache({
                                name: serviceFieldName,
                                cache: {
                                    [entityParametersError.instancePath]: {
                                        ...entityParametersError.params,
                                        result,
                                    },
                                },
                            });
                        });
                    } else {
                        entityParametersErrors.push({
                            path: [
                                ...parseFinalFormPath(headName),
                                ...parseInstancePath(entityParametersError.instancePath),
                            ],
                            error: errorOrPromise,
                        });
                    }
                }
            } else {
                const ajvError = ajvOrEntityParametersError as ErrorObject;

                let instancePath = ajvError.instancePath;
                let keyword = ajvError.keyword;
                let schemaPath = ajvError.schemaPath;

                if (keyword === 'required' || keyword === 'dependencies') {
                    instancePath += `/${ajvError.params.missingProperty}`;
                } else if (keyword === 'if') {
                    keyword = ajvError.params.failingKeyword;
                    schemaPath = schemaPath.slice(0, -'if'.length) + ajvError.params.failingKeyword;
                }

                ajvErrors.push({
                    path: [
                        ...parseFinalFormPath(headName),
                        ...parseInstancePath(ajvError.instancePath),
                    ],
                    error: getAjvErrorMessage({
                        ajvErrorMessage: ajvError.message,
                        errorMessages,
                        instancePath,
                        keyword,
                        mainSchema,
                        schemaPath,
                    }),
                });
            }
        });

        if (Object.keys(waiters).length) {
            setValidationWaiters({name: serviceFieldName, waiters});
        }

        const errorsState: ErrorsState | undefined = meta?.data;
        const externalRegularErrors: {path: string[]; error: SyncValidateError}[] = Object.values(
            mapValues(errorsState?.regularErrors, (value, key) => ({
                path: parseFinalFormPath(key),
                error: value,
            })),
        );
        const externalPriorityErrors: {path: string[]; error: SyncValidateError}[] = Object.values(
            mapValues(errorsState?.priorityErrors, (value, key) => ({
                path: parseFinalFormPath(key),
                error: value,
            })),
        );

        [
            ...externalRegularErrors,
            ...ajvErrors,
            ...entityParametersErrors,
            ...externalPriorityErrors,
        ].forEach((item) => {
            if (item.error) {
                const itemSchema = getSchemaByFinalFormPath(item.path, headName, mainSchema);

                if (itemSchema) {
                    const arraySchema = itemSchema.type === JsonSchemaType.Array;
                    const objectSchema = itemSchema.type === JsonSchemaType.Object;

                    set(
                        arraySchema || objectSchema ? result[ARRAY_AND_OBJECT_ERRORS] : result,
                        objectSchema ? [...item.path, OBJECT_ERROR] : item.path,
                        item.error,
                    );
                }
            }
        });

        return result;
    };
};
