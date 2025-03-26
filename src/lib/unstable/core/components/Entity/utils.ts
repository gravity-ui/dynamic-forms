import type {ErrorObject, FuncKeywordDefinition, SchemaValidateFunction} from 'ajv';
import Ajv from 'ajv';
import {ARRAY_ERROR} from 'final-form';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import isString from 'lodash/isString';
import omit from 'lodash/omit';
import set from 'lodash/set';

import {EMPTY_OBJECT, JsonSchemaType} from '../../constants';
import type {
    FieldValue,
    JsonSchema,
    ObjectValue,
    SyncValidateError,
    ValidationState,
    ValidationWaiter,
    Validator,
    View,
    Wrapper,
} from '../../types';

import type {
    EntityParametersError,
    GetAjvValidateParams,
    GetAjvValidateReturn,
    GetRenderKitParams,
    GetRenderKitReturn,
    GetValidateParams,
    GetValidateReturn,
} from './types';

export const getRenderKit = <Schema extends JsonSchema>({
    config,
    mode,
    schema,
}: GetRenderKitParams<Schema>): GetRenderKitReturn<Schema> => {
    const viewType: string | undefined = get(schema, 'entityParameters.viewType');
    const wrapperType: string | undefined = get(schema, 'entityParameters.wrapperType');

    const viewProps = get(schema, 'entityParameters.viewProps', EMPTY_OBJECT);
    const wrapperProps = get(schema, 'entityParameters.wrapperProps', EMPTY_OBJECT);

    const ViewComponent: View<Schema> | undefined = get(
        config,
        `${schema.type}.views.${viewType}.${mode}.Component`,
    );
    const WrapperComponent: Wrapper<Schema> | undefined = get(
        config,
        `${schema.type}.wrappers.${wrapperType}`,
    );
    const independent: boolean | undefined = get(
        config,
        `${schema.type}.views.${viewType}.${mode}.independent`,
    );

    return {
        View: ViewComponent,
        viewProps,
        Wrapper: WrapperComponent,
        wrapperProps,
        independent,
    };
};

export const getAjvValidate = ({
    config,
    schema: mainSchema,
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

const getSchemaBySchemaPath = (
    schemaPath: string,
    keyword: string,
    mainSchema: JsonSchema,
): JsonSchema | undefined => {
    const sp = decodeURIComponent(schemaPath);
    let result = mainSchema;

    if (sp !== `#/${keyword}`) {
        const pathArr = sp.substring('#/'.length, sp.length - `/${keyword}`.length).split('/');

        result = get(mainSchema, pathArr);
    }

    return result;
};

const getSchemaByInstancePath = (
    instancePath: string,
    mainSchema: JsonSchema,
): JsonSchema | undefined => {
    let result: JsonSchema | undefined = mainSchema;

    if (instancePath.length) {
        const pathArr = instancePath.substring('/'.length).split('/');

        result = pathArr.reduce((acc: JsonSchema | undefined, subpath) => {
            const type = get(acc, 'type');

            if (type === JsonSchemaType.Object) {
                return get(acc, `properties.${subpath}`);
            } else if (type === JsonSchemaType.Array) {
                const items = get(acc, 'items');

                if (Array.isArray(items)) {
                    return get(items, `[${subpath}]`);
                }

                return items;
            }

            return undefined;
        }, mainSchema);
    }

    return result;
};

const isEntityParametersError = (
    error: ErrorObject | EntityParametersError,
): error is EntityParametersError => error.keyword === 'entityParameters';

const getErrorMessageBySchema = (schema: JsonSchema | undefined, keyword: string, name: string) => {
    const errorOrMap: Record<string, string> | string | undefined = get(
        schema,
        `entityParameters.errorMessages.${keyword}`,
    );
    const message: string | undefined = isString(errorOrMap) ? errorOrMap : get(errorOrMap, name);

    return message;
};

const getError = (schema: JsonSchema, message: SyncValidateError) => {
    if (schema.type === JsonSchemaType.Array) {
        const arrayError = set([], ARRAY_ERROR, message);

        return arrayError;
    }

    if (schema.type === JsonSchemaType.Object) {
        const objectError = set({}, 'FINAL_FORM/object-error', message);

        return objectError;
    }

    return message;
};

export const getValidate = <Schema extends JsonSchema>({
    config,
    errorMessages,
    name,
    schema,
    setValidationCache,
    setValidationWaiters,
}: GetValidateParams<Schema>): GetValidateReturn<Schema> => {
    const ajvValidate = getAjvValidate({config, schema});

    return (value, allValues, meta) => {
        ajvValidate(value);

        if (!ajvValidate.errors?.length) {
            return false;
        }

        const waiters: Record<string, ValidationWaiter> = {};
        const errors: {instancePath: string; error: SyncValidateError}[] = [];
        const priorityErrors: {instancePath: string; error: SyncValidateError}[] = [];

        ajvValidate.errors.forEach((ajvError) => {
            if (isEntityParametersError(ajvError)) {
                const {instancePath, params} = ajvError;
                const validationState: ValidationState | undefined = meta?.data;

                const waiter = validationState?.waiters?.[instancePath];
                const cache = validationState?.cache?.[instancePath];
                const cacheItem = cache?.find((item) => isEqual(params, omit(item, 'result')));

                if (cacheItem?.result) {
                    priorityErrors.push({
                        instancePath: instancePath,
                        error: cacheItem.result,
                    });
                } else if (!waiter || !isEqual(params, waiter)) {
                    const errorOrPromise = params.validator(params.value, allValues as ObjectValue);

                    if (errorOrPromise instanceof Promise) {
                        waiters[instancePath] = params;

                        errorOrPromise.then((result) => {
                            setValidationCache({
                                name,
                                cache: {[ajvError.instancePath]: {...ajvError.params, result}},
                            });
                        });
                    } else {
                        priorityErrors.push({
                            instancePath: instancePath,
                            error: errorOrPromise,
                        });
                    }
                }
            } else {
                let instancePath = ajvError.instancePath;
                let keyword = ajvError.keyword;
                let schemaPath = ajvError.schemaPath;

                if (keyword === 'required' || keyword === 'dependencies') {
                    instancePath += `/${ajvError.params.missingProperty}`;
                } else if (keyword === 'if') {
                    keyword = ajvError.params.failingKeyword;
                    schemaPath = schemaPath.slice(0, -'if'.length) + ajvError.params.failingKeyword;
                }

                const spSchema: JsonSchema | undefined = getSchemaBySchemaPath(
                    schemaPath,
                    keyword,
                    schema,
                );
                const ipSchema: JsonSchema | undefined = getSchemaByInstancePath(
                    instancePath,
                    schema,
                );

                const propertyName = instancePath.split('/').pop() as string;
                const error: string | undefined =
                    getErrorMessageBySchema(spSchema, keyword, propertyName) ||
                    getErrorMessageBySchema(ipSchema, keyword, propertyName) ||
                    errorMessages[keyword as keyof typeof errorMessages] ||
                    ajvError.message;

                errors.push({
                    instancePath,
                    error,
                });
            }
        });

        if (Object.keys(waiters).length) {
            setValidationWaiters({name, waiters: waiters});
        }

        const error = set({}, name, undefined);

        [...errors, ...priorityErrors].forEach((item) => {
            if (item.error) {
                const path = [
                    ...(name.length ? name.split('.') : []),
                    ...(item.instancePath
                        ? item.instancePath.substring('/'.length).split('/')
                        : []),
                ];

                const itemSchema = getSchemaByInstancePath(item.instancePath, schema);

                if (itemSchema) {
                    set(error, path, getError(itemSchema, item.error));
                }
            }
        });

        // сетить ошибки массивов и объектов в отдельное место в сторе формы

        return get(error, name);
    };
};
