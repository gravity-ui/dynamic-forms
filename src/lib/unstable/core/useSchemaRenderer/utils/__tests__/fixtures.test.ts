import type {FieldState} from 'final-form';

import {EntityType} from '../../../constants';
import type {
    ErrorMessages,
    FieldValue,
    JsonSchema,
    ObjectValue,
    SchemaRendererConfig,
} from '../../../types';
import type {SchemaRendererState} from '../../types';
import {type GetAjvValidateParams, getAjvValidate} from '../get-ajv-validate';
import {type GetValidateParams, getValidate} from '../get-validate';
import {type ProcessAjvErrorParams, processAjvError} from '../process-ajv-error';
import {
    type ProcessAjvValidateErrorsParams,
    processAjvValidateErrors,
} from '../process-ajv-validate-errors';
import {
    type ProcessEntityParametersErrorParams,
    processEntityParametersError,
} from '../process-entity-parameters-error';

export const FIELD_NAME = 'head';

const GLOBAL_PREFIX = 'global';
const SCHEMA_PREFIX = 'schema';
const KEYWORD_SCHEMA_PREFIX = 'keyword schema';

export const CUSTOM_VALIDATOR_WITH_ERROR_TYPE = 'customValidatorWithError';
export const CUSTOM_ASYNC_VALIDATOR_WITH_ERROR_TYPE = 'customAsyncValidatorWithError';

const getErrorMessages = (prefix: string): Required<ErrorMessages> => ({
    additionalItems: `${prefix} additionalItems message`,
    additionalProperties: `${prefix} additionalProperties message`,
    anyOf: `${prefix} anyOf message`,
    const: `${prefix} const message`,
    contains: `${prefix} contains message`,
    dependencies: `${prefix} dependencies message`,
    enum: `${prefix} enum message`,
    exclusiveMaximum: `${prefix} exclusiveMaximum message`,
    exclusiveMinimum: `${prefix} exclusiveMinimum message`,
    maxItems: `${prefix} maxItems message`,
    maxLength: `${prefix} maxLength message`,
    maxProperties: `${prefix} maxProperties message`,
    maximum: `${prefix} maximum message`,
    minItems: `${prefix} minItems message`,
    minLength: `${prefix} minLength message`,
    minProperties: `${prefix} minProperties message`,
    minimum: `${prefix} minimum message`,
    multipleOf: `${prefix} multipleOf message`,
    not: `${prefix} not message`,
    oneOf: `${prefix} oneOf message`,
    pattern: `${prefix} pattern message`,
    propertyNames: `${prefix} propertyNames message`,
    required: `${prefix} required message`,
    type: `${prefix} type message`,
    uniqueItems: `${prefix} uniqueItems message`,
});

export const GLOBAL_ERROR_MESSAGES = getErrorMessages(GLOBAL_PREFIX);
export const SCHEMA_ERROR_MESSAGES = getErrorMessages(SCHEMA_PREFIX);
export const KEYWORD_SCHEMA_ERROR_MESSAGES = getErrorMessages(KEYWORD_SCHEMA_PREFIX);
export const CUSTOM_VALIDATOR_WITH_ERROR_MESSAGE = 'custom validator error message';
export const CUSTOM_ASYNC_VALIDATOR_WITH_ERROR_MESSAGE = 'custom async validator error message';
export const AJV_MESSAGES = {
    additionalItems: (limit: number) => `must NOT have more than ${limit} items`,
    additionalProperties: 'must NOT have additional properties',
    anyOf: 'must match a schema in anyOf',
    const: 'must be equal to constant',
    contains: 'must contain at least 1 valid item(s)',
    dependencies: (deps: string, property: string) =>
        `must have property ${deps} when property ${property} is present`,
    else: 'must match "else" schema',
    enum: 'must be equal to one of the allowed values',
    exclusiveMaximum: (limit: number) => `must be < ${limit}`,
    exclusiveMinimum: (limit: number) => `must be > ${limit}`,
    maximum: (limit: number) => `must be <= ${limit}`,
    maxLength: (limit: number) => `must NOT have more than ${limit} characters`,
    maxItems: (limit: number) => `must NOT have more than ${limit} items`,
    maxProperties: (limit: number) => `must NOT have more than ${limit} properties`,
    minItems: (limit: number) => `must NOT have fewer than ${limit} items`,
    minProperties: (limit: number) => `must NOT have fewer than ${limit} properties`,
    minimum: (limit: number) => `must be >= ${limit}`,
    minLength: (limit: number) => `must NOT have fewer than ${limit} characters`,
    multipleOf: (limit: number) => `must be multiple of ${limit}`,
    not: 'must NOT be valid',
    oneOf: 'must match exactly one schema in oneOf',
    pattern: (pattern: string) => `must match pattern "${pattern}"`,
    propertyNames: 'property name must be valid',
    required: (prop: string) => `must have required property '${prop}'`,
    then: 'must match "then" schema',
    typeArray: 'must be array',
    typeBoolean: 'must be boolean',
    typeInteger: 'must be integer',
    typeNumber: 'must be number',
    typeObject: 'must be object',
    typeString: 'must be string',
    uniqueItems: (i: number, j: number) =>
        `must NOT have duplicate items (items ## ${i} and ${j} are identical)`,
} as const;

export const customValidatorWithError = () => CUSTOM_VALIDATOR_WITH_ERROR_MESSAGE;
export const customAsyncValidatorWithError = () =>
    Promise.resolve(CUSTOM_ASYNC_VALIDATOR_WITH_ERROR_MESSAGE);

export const SCHEMA_RENDERER_CONFIG: SchemaRendererConfig = {
    [EntityType.Any]: {
        controls: {},
        views: {},
        wrappers: {},
        validators: {
            [CUSTOM_VALIDATOR_WITH_ERROR_TYPE]: customValidatorWithError,
            [CUSTOM_ASYNC_VALIDATOR_WITH_ERROR_TYPE]: customAsyncValidatorWithError,
        },
    },
    [EntityType.Array]: {
        controls: {},
        views: {},
        wrappers: {},
        validators: {
            [CUSTOM_VALIDATOR_WITH_ERROR_TYPE]: customValidatorWithError,
            [CUSTOM_ASYNC_VALIDATOR_WITH_ERROR_TYPE]: customAsyncValidatorWithError,
        },
    },
    [EntityType.Boolean]: {
        controls: {},
        views: {},
        wrappers: {},
        validators: {
            [CUSTOM_VALIDATOR_WITH_ERROR_TYPE]: customValidatorWithError,
            [CUSTOM_ASYNC_VALIDATOR_WITH_ERROR_TYPE]: customAsyncValidatorWithError,
        },
    },
    [EntityType.Number]: {
        controls: {},
        views: {},
        wrappers: {},
        validators: {
            [CUSTOM_VALIDATOR_WITH_ERROR_TYPE]: customValidatorWithError,
            [CUSTOM_ASYNC_VALIDATOR_WITH_ERROR_TYPE]: customAsyncValidatorWithError,
        },
    },
    [EntityType.Object]: {
        controls: {},
        views: {},
        wrappers: {},
        validators: {
            [CUSTOM_VALIDATOR_WITH_ERROR_TYPE]: customValidatorWithError,
            [CUSTOM_ASYNC_VALIDATOR_WITH_ERROR_TYPE]: customAsyncValidatorWithError,
        },
    },
    [EntityType.String]: {
        controls: {},
        views: {},
        wrappers: {},
        validators: {
            [CUSTOM_VALIDATOR_WITH_ERROR_TYPE]: customValidatorWithError,
            [CUSTOM_ASYNC_VALIDATOR_WITH_ERROR_TYPE]: customAsyncValidatorWithError,
        },
    },
};

export const createValidate = (params?: Partial<GetValidateParams>) => {
    const {
        config = SCHEMA_RENDERER_CONFIG,
        errorMessages = {},
        name = FIELD_NAME,
        setAsyncValidationCache = jest.fn(),
        setAsyncValidationWaiters = jest.fn(),
        setErrors = jest.fn(),
    } = params || {};

    const originalValidate = getValidate({
        config,
        errorMessages,
        name,
        setAsyncValidationCache,
        setAsyncValidationWaiters,
        setErrors,
    });

    const validate = (
        value: FieldValue,
        data?: Partial<SchemaRendererState>,
        allValues: ObjectValue = {},
    ) => originalValidate(value, allValues, {data} as unknown as FieldState<FieldValue>);

    return {
        originalValidate,
        validate,
        setAsyncValidationCache,
        setAsyncValidationWaiters,
        setErrors,
    };
};

export const createAjvValidate = ({
    config = SCHEMA_RENDERER_CONFIG,
    schema,
}: Pick<Partial<GetAjvValidateParams>, 'config'> & Pick<GetAjvValidateParams, 'schema'>) => {
    return getAjvValidate({config, schema});
};

export const createProcessAjvValidateErrors = () => {
    const setAsyncValidationCacheJest = jest.fn();

    const process = ({
        ajvValidateErrors,
        errorMessages = {},
        name = FIELD_NAME,
        schema,
        setAsyncValidationCache = setAsyncValidationCacheJest,
        validationState,
    }: Omit<Partial<ProcessAjvValidateErrorsParams<JsonSchema>>, 'ajvValidateErrors' | 'schema'> &
        Pick<ProcessAjvValidateErrorsParams<JsonSchema>, 'ajvValidateErrors' | 'schema'>) =>
        processAjvValidateErrors({
            ajvValidateErrors,
            allValues: {},
            errorMessages: errorMessages || {},
            name,
            schema,
            setAsyncValidationCache,
            validationState,
        });

    return {
        processAjvValidateErrors: process,
        setAsyncValidationCache: setAsyncValidationCacheJest,
    };
};

export const createProcessAjvError = () => {
    const onErrorJest = jest.fn();

    const process = ({
        error,
        errorMessages = {},
        onError = onErrorJest,
        schema,
    }: Omit<ProcessAjvErrorParams<JsonSchema>, 'errorMessages' | 'onError'> &
        Pick<Partial<ProcessAjvErrorParams<JsonSchema>>, 'errorMessages' | 'onError'>) =>
        processAjvError({error, errorMessages, schema, onError});

    return {processAjvError: process, onError: onErrorJest};
};

export const createProcessEntityParametersError = () => {
    const onAsyncErrorJest = jest.fn();
    const onErrorJest = jest.fn();

    const process = ({
        allValues = {},
        error,
        onAsyncError = onAsyncErrorJest,
        onError = onErrorJest,
        validationState = undefined,
    }: Omit<Partial<ProcessEntityParametersErrorParams>, 'error'> &
        Pick<ProcessEntityParametersErrorParams, 'error'>) =>
        processEntityParametersError({
            allValues,
            error,
            onAsyncError,
            onError,
            validationState,
        });

    return {
        processEntityParametersError: process,
        onAsyncError: onAsyncErrorJest,
        onError: onErrorJest,
    };
};

test.skip('fixtures', () => {});
