import type {ErrorObject, FuncKeywordDefinition, SchemaValidateFunction} from 'ajv';
import Ajv from 'ajv';
import get from 'lodash/get';
import isBoolean from 'lodash/isBoolean';
import isEqual from 'lodash/isEqual';
import isObjectLike from 'lodash/isObjectLike';
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';
import mapValues from 'lodash/mapValues';
import omit from 'lodash/omit';
import set from 'lodash/set';

import {ARRAY_AND_OBJECT_ERRORS, EMPTY_OBJECT, JsonSchemaType} from '../constants';
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
    ProcessAjvErrorParams,
    ProcessAjvValidateErrorsParams,
    ProcessAjvValidateErrorsReturn,
    ProcessEntityParametersErrorParams,
    ProcessErrorItemsParams,
    ProcessErrorItemsReturn,
    ProcessErrorsStateParams,
    ProcessErrorsStateReturn,
    ValidateErrorItem,
} from './types';

export const getAjvValidate = ({
    config,
    mainSchema,
}: GetAjvValidateParams): GetAjvValidateReturn => {
    function entityParametersValidate(_: unknown, value: FieldValue, schema?: JsonSchema) {
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

/**
 * Extracts the path to the property from a JSON Schema validation error.
 * Assumes that the last segment in the `schemaPath` is the keyword
 * that triggered the validation error (e.g., "minLength").
 *
 * @param schemaPath - A JSON Pointer string representing the schema path,
 *   e.g., "#/properties/name/minLength"
 * @returns An array of path segments leading to the property, excluding the keyword,
 *   e.g., ['properties', 'name']
 */
export const parseSchemaPath = (schemaPath: string): string[] => {
    return decodeURIComponent(schemaPath)
        .slice('#/'.length)
        .split('/')
        .map((segment) => segment.replace(/~1/g, '/').replace(/~0/g, '~'))
        .slice(0, -1);
};

export const parseInstancePath = (instancePath: string): string[] => {
    if (!instancePath.length) {
        return [];
    }

    return instancePath
        .slice('/'.length)
        .split('/')
        .map((segment) => segment.replace(/~1/g, '/').replace(/~0/g, '~'));
};

/**
 * Retrieves the sub-schema from the main schema based on the given schema path.
 * Assumes that the last segment in the `schemaPath` is a validation keyword
 * (e.g., "minLength") and not part of the property path.
 *
 * @param schemaPath - A JSON Pointer-style string representing the schema path,
 *   e.g., "#/properties/name/minLength".
 * @param mainSchema - The root JSON schema object.
 *
 * @example
 * const nameSchema = {
 *   type: JsonSchemaType.String,
 *   minLength: 5,
 * };
 * const objectSchema = {
 *   type: JsonSchemaType.Object,
 *   properties: {
 *     name: nameSchema,
 *   },
 * };
 * getSchemaFromPath("#/properties/name/minLength", objectSchema); // returns nameSchema
 *
 * @returns The sub-schema object corresponding to the property path.
 */
export const getSchemaBySchemaPath = (
    schemaPath: string,
    mainSchema: JsonSchema,
): JsonSchema | undefined => {
    const pathArr = parseSchemaPath(schemaPath);

    if (!pathArr.length) {
        return mainSchema;
    }

    return get(mainSchema, pathArr);
};

export const getSchemaByInstancePath = (
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

export const getValuePaths = (value: unknown, path: string[] = []) => {
    const result: string[][] = [];

    const isObject = (v: unknown): v is Record<string, unknown> =>
        v !== null && typeof v === 'object' && !Array.isArray(v);

    if (Array.isArray(value)) {
        value.forEach((_, index) => {
            result.push(...getValuePaths(value[index], [...path, `${index}`]));
        });
    } else if (isObject(value)) {
        Object.keys(value).forEach((key) => {
            result.push(...getValuePaths(get(value, key), [...path, key]));
        });
    } else if (path.length) {
        result.push(path);
    }

    return result;
};

const processEntityParametersError = ({
    allValues,
    error,
    headName,
    onAsyncError,
    onError,
    validationState,
}: ProcessEntityParametersErrorParams) => {
    const waiter = validationState?.waiters?.[error.instancePath];
    const cache = validationState?.cache?.[error.instancePath];
    const cacheItem = cache?.find((item) => isEqual(error.params, omit(item, 'result')));

    if (cacheItem?.result) {
        onError({
            error: cacheItem.result,
            path: [...parseFinalFormPath(headName), ...parseInstancePath(error.instancePath)],
        });
    } else if (!waiter || !isEqual(error.params, waiter)) {
        const errorOrPromise = error.params.validator(error.params.value, allValues as ObjectValue);

        if (errorOrPromise instanceof Promise) {
            onAsyncError({
                instancePath: error.instancePath,
                params: error.params,
                promise: errorOrPromise,
            });
        } else {
            onError({
                error: errorOrPromise,
                path: [...parseFinalFormPath(headName), ...parseInstancePath(error.instancePath)],
            });
        }
    }
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

const processAjvError = <Schema extends JsonSchema>({
    error,
    errorMessages,
    headName,
    mainSchema,
    onError,
}: ProcessAjvErrorParams<Schema>) => {
    let instancePath = error.instancePath;
    let keyword = error.keyword;
    let schemaPath = error.schemaPath;

    if (keyword === 'required' || keyword === 'dependencies') {
        instancePath += `/${error.params.missingProperty}`;
    } else if (keyword === 'if') {
        keyword = error.params.failingKeyword;
        schemaPath = schemaPath.slice(0, -'if'.length) + error.params.failingKeyword;
    }

    onError({
        path: [...parseFinalFormPath(headName), ...parseInstancePath(error.instancePath)],
        error: getAjvErrorMessage({
            ajvErrorMessage: error.message,
            errorMessages,
            instancePath,
            keyword,
            mainSchema,
            schemaPath,
        }),
    });
};

const processAjvValidateErrors = <Schema extends JsonSchema>({
    ajvValidateErrors,
    allValues,
    errorMessages,
    headName,
    mainSchema,
    serviceFieldName,
    setValidationCache,
    validationState,
}: ProcessAjvValidateErrorsParams<Schema>): ProcessAjvValidateErrorsReturn => {
    const waiters: Record<string, ValidationWaiter> = {};
    const ajvErrorItems: ValidateErrorItem[] = [];
    const entityParametersErrorItems: ValidateErrorItem[] = [];

    ajvValidateErrors.forEach((ajvOrEntityParametersError) => {
        if (ajvOrEntityParametersError.keyword === 'entityParameters') {
            processEntityParametersError({
                allValues: allValues,
                error: ajvOrEntityParametersError as EntityParametersError,
                headName,
                onAsyncError: (w) => {
                    waiters[w.instancePath] = w.params;

                    w.promise.then((result) => {
                        setValidationCache({
                            cache: {
                                [w.instancePath]: {
                                    ...w.params,
                                    result,
                                },
                            },
                            serviceFieldName,
                        });
                    });
                },
                onError: (err) => entityParametersErrorItems.push(err),
                validationState,
            });
        } else {
            processAjvError({
                error: ajvOrEntityParametersError as ErrorObject,
                errorMessages,
                headName,
                mainSchema,
                onError: (err) => ajvErrorItems.push(err),
            });
        }
    });

    return {ajvErrorItems, entityParametersErrorItems, waiters};
};

const processErrorsState = ({errorsState}: ProcessErrorsStateParams): ProcessErrorsStateReturn => {
    const getErrorItems = (errors: ErrorsState['priorityErrors'] | ErrorsState['regularErrors']) =>
        Object.values(
            mapValues(errors, (value, key) => ({
                path: parseFinalFormPath(key),
                error: value,
            })),
        );

    return {
        externalPriorityErrorItems: getErrorItems(errorsState?.priorityErrors),
        externalRegularErrorItems: getErrorItems(errorsState?.regularErrors),
    };
};

const processErrorItems = <Schema extends JsonSchema>({
    errorItems,
    headName,
    mainSchema,
}: ProcessErrorItemsParams<Schema>): ProcessErrorItemsReturn => {
    const result: ProcessErrorItemsReturn = {
        [ARRAY_AND_OBJECT_ERRORS]: {},
    };

    const setError = (path: string[], error: boolean | string | undefined) => {
        const itemSchema = getSchemaByFinalFormPath(path, headName, mainSchema);

        if (itemSchema) {
            const arrayOrObjectSchema =
                itemSchema.type === JsonSchemaType.Array ||
                itemSchema.type === JsonSchemaType.Object;

            if (arrayOrObjectSchema) {
                result[ARRAY_AND_OBJECT_ERRORS][path.join('.')] = error;
            } else {
                set(result, path, error);
            }
        }
    };

    errorItems.forEach((item) => {
        if (!item.error) {
            return;
        }

        if (isObjectLike(item.error)) {
            getValuePaths(item.error).forEach((path) => {
                setError([...item.path, ...path], get(item.error, path));
            });

            return;
        }

        if (isBoolean(item.error) || isString(item.error) || isUndefined(item.error)) {
            setError(item.path, item.error);

            return;
        }
    });

    return result;
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

        const {ajvErrorItems, entityParametersErrorItems, waiters} = processAjvValidateErrors({
            ajvValidateErrors: ajvValidate.errors || [],
            allValues: allValues as ObjectValue,
            errorMessages,
            headName,
            mainSchema,
            serviceFieldName,
            setValidationCache,
            validationState: meta?.data as ValidationState | undefined,
        });
        const {externalPriorityErrorItems, externalRegularErrorItems} = processErrorsState({
            errorsState: meta?.data as ErrorsState | undefined,
        });

        if (Object.keys(waiters).length) {
            setValidationWaiters({serviceFieldName, waiters});
        }

        const result = processErrorItems({
            errorItems: [
                ...externalRegularErrorItems,
                ...ajvErrorItems,
                ...entityParametersErrorItems,
                ...externalPriorityErrorItems,
            ],
            headName,
            mainSchema,
        });

        return result;
    };
};
