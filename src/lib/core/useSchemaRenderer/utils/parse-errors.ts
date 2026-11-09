import type {FormApi} from 'final-form';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import omit from 'lodash/omit';

import type {ErrorMessages, JSLErrors, JsonSchema, ObjectValue, ValidationError} from '../../types';
import {
    arrayPathToDotBracket,
    dotBracketToArrayPath,
    getSchemaByPointer,
    pointerToArrayPath,
} from '../../utils';
import type {SchemaRendererState, ValidationWaiter} from '../types';

export interface ParseErrorParams {
    allValues: ObjectValue;
    error: JSLErrors.Error;
    form: FormApi<any>;
    headName: string;
    setJSLError: (name: string, error: ValidationError) => void;
    setNPError: (name: string, error: ValidationError) => void;
    setWaiter: (name: string, waiter: ValidationWaiter) => void;
    state: SchemaRendererState;
}

const getNameFromRoot = (headName: string, pointer: string) =>
    arrayPathToDotBracket([...dotBracketToArrayPath(headName), ...pointerToArrayPath(pointer)]);

const extractMessage = (
    messages:
        | ErrorMessages
        | NonNullable<JsonSchema['nodeParameters']>['errorMessages']
        | undefined,
    error: JSLErrors.Error,
): string | undefined => {
    const codeToKeyword: Record<JSLErrors.ErrorCode, keyof ErrorMessages | undefined> = {
        'additional-items-error': 'additionalItems',
        'any-of-error': 'anyOf',
        'const-error': 'const',
        'contains-any-error': 'contains',
        'contains-min-error': 'contains',
        'enum-error': 'enum',
        'exclusive-maximum-error': 'exclusiveMaximum',
        'exclusive-minimum-error': 'exclusiveMinimum',
        'invalid-property-name-error': 'propertyNames',
        'max-items-error': 'maxItems',
        'max-length-error': 'maxLength',
        'max-properties-error': 'maxProperties',
        'maximum-error': 'maximum',
        'min-items-error': 'minItems',
        'min-length-error': 'minLength',
        'min-properties-error': 'minProperties',
        'minimum-error': 'minimum',
        'missing-dependency-error': 'dependencies',
        'multiple-of-error': 'multipleOf',
        'no-additional-properties-error': 'additionalProperties',
        'node-parameters-error': undefined,
        'not-error': 'not',
        'one-of-error': 'oneOf',
        'pattern-error': 'pattern',
        'required-property-error': 'required',
        'type-error': 'type',
        'unique-items-error': 'uniqueItems',
    };

    const keyword = codeToKeyword[error.code];
    const messageBySchema = keyword ? messages?.[keyword] : undefined;

    if (isString(messageBySchema)) {
        return messageBySchema;
    }

    if (isFunction(messageBySchema)) {
        return (messageBySchema as (e: JSLErrors.Error) => string)(error);
    }

    const codeToPropertyKey: Partial<Record<JSLErrors.ErrorCode, string>> = {
        'missing-dependency-error': 'missingProperty',
        'required-property-error': 'key',
    };

    const propertyKey = codeToPropertyKey[error.code];

    if (isObject(messageBySchema) && propertyKey) {
        const message = get(messageBySchema, get(error.data, propertyKey));

        if (isString(message)) {
            return message;
        }

        if (isFunction(message)) {
            return (message as (e: JSLErrors.Error) => string)(error);
        }
    }

    return undefined;
};

const getInstanceSchema = ({
    error,
    form,
    headName,
    state,
}: ParseErrorParams): JsonSchema | undefined => {
    const nameFromRoot = getNameFromRoot(headName, error.data.pointer);
    const field = form.getFieldState(nameFromRoot);
    const schemaPath = field?.data?.schemaPath;

    if (schemaPath) {
        const schema = getSchemaByPointer(state.schema, schemaPath);

        if (schema) {
            return schema;
        }
    }

    return undefined;
};

const parseError = (params: ParseErrorParams) => {
    const {error, headName, setJSLError, state} = params;

    const nameFromRoot = getNameFromRoot(headName, error.data.pointer);
    const message =
        extractMessage(error.data.schema.nodeParameters?.errorMessages, error) ||
        extractMessage(getInstanceSchema(params)?.nodeParameters?.errorMessages, error) ||
        extractMessage(state.errorMessages, error) ||
        error.message;

    setJSLError(nameFromRoot, message);
};

const parseAdditionalItemsError = (params: ParseErrorParams) => {
    const {error, form, headName, setJSLError, state} = params;

    if (error.code !== 'additional-items-error') {
        return;
    }

    const nameFromRoot = getNameFromRoot(headName, error.data.pointer);

    const parentPointer = error.data.pointer.replace(/\/[^/]*$/, '');
    const parentError = {
        ...error,
        data: {...error.data, pointer: parentPointer},
    } as JSLErrors.Error;
    const parentParams = {...params, error: parentError};

    if (form.getFieldState(nameFromRoot)) {
        const message =
            extractMessage(error.data.schema.nodeParameters?.errorMessages, error) ||
            extractMessage(getInstanceSchema(params)?.nodeParameters?.errorMessages, error) ||
            extractMessage(getInstanceSchema(parentParams)?.nodeParameters?.errorMessages, error) ||
            extractMessage(state.errorMessages, error) ||
            error.message;

        setJSLError(nameFromRoot, message);
    } else {
        parseError(parentParams);
    }
};

const parseSchemaContainsError = (params: ParseErrorParams) => {
    const {error, headName, setJSLError, state} = params;

    if (error.code !== 'contains-min-error') {
        return;
    }

    const nameFromRoot = getNameFromRoot(headName, error.data.pointer);
    const message =
        extractMessage(error.data.schema.contains.nodeParameters?.errorMessages, error) ||
        extractMessage(error.data.schema.nodeParameters?.errorMessages, error) ||
        extractMessage(getInstanceSchema(params)?.nodeParameters?.errorMessages, error) ||
        extractMessage(state.errorMessages, error) ||
        error.message;

    setJSLError(nameFromRoot, message);
};

const parseInvalidPropertyNameError = (params: ParseErrorParams) => {
    const {error, form, headName, setJSLError, state} = params;

    if (error.code !== 'invalid-property-name-error') {
        return;
    }

    const nestedError = error.data.validationError;
    const propertyNameFromRoot = getNameFromRoot(headName, nestedError.data.pointer);

    if (form.getFieldState(propertyNameFromRoot)) {
        const nestedParams = {...params, error: nestedError};
        const message =
            extractMessage(nestedError.data.schema.nodeParameters?.errorMessages, nestedError) ||
            extractMessage(
                getInstanceSchema(nestedParams)?.nodeParameters?.errorMessages,
                nestedError,
            ) ||
            extractMessage(error.data.schema.nodeParameters?.errorMessages, error) ||
            extractMessage(getInstanceSchema(params)?.nodeParameters?.errorMessages, error) ||
            extractMessage(state.errorMessages, nestedError) ||
            extractMessage(state.errorMessages, error) ||
            nestedError.message;

        setJSLError(propertyNameFromRoot, message);
    } else {
        const nameFromRoot = getNameFromRoot(headName, error.data.pointer);
        const message =
            extractMessage(nestedError.data.schema.nodeParameters?.errorMessages, error) ||
            extractMessage(error.data.schema.nodeParameters?.errorMessages, error) ||
            extractMessage(getInstanceSchema(params)?.nodeParameters?.errorMessages, error) ||
            extractMessage(state.errorMessages, error) ||
            error.message;

        setJSLError(nameFromRoot, message);
    }
};

const parseMissingDependencyError = (params: ParseErrorParams) => {
    const {error, form, headName, setJSLError, state} = params;

    if (error.code !== 'missing-dependency-error') {
        return;
    }

    const propertyPointer = `${error.data.pointer}/${error.data.missingProperty}`;
    const propertyNameFromRoot = getNameFromRoot(headName, propertyPointer);

    if (form.getFieldState(propertyNameFromRoot)) {
        const propertyError = {
            ...error,
            data: {...error.data, pointer: propertyPointer},
        } as JSLErrors.Error;

        const message =
            extractMessage(
                propertyError.data.schema.nodeParameters?.errorMessages,
                propertyError,
            ) ||
            extractMessage(
                getInstanceSchema({...params, error: propertyError})?.nodeParameters?.errorMessages,
                propertyError,
            ) ||
            extractMessage(
                getInstanceSchema(params)?.nodeParameters?.errorMessages,
                propertyError,
            ) ||
            extractMessage(state.errorMessages, propertyError) ||
            propertyError.message;

        setJSLError(propertyNameFromRoot, message);
    } else {
        const nameFromRoot = getNameFromRoot(headName, error.data.pointer);
        const message =
            extractMessage(error.data.schema.nodeParameters?.errorMessages, error) ||
            extractMessage(getInstanceSchema(params)?.nodeParameters?.errorMessages, error) ||
            extractMessage(state.errorMessages, error) ||
            error.message;

        setJSLError(nameFromRoot, message);
    }
};

const parseAdditionalPropertiesError = (params: ParseErrorParams) => {
    const {error, form, headName, setJSLError, state} = params;

    if (error.code !== 'no-additional-properties-error') {
        return;
    }

    const nameFromRoot = getNameFromRoot(headName, error.data.pointer);

    const parentPointer = error.data.pointer.replace(/\/[^/]*$/, '');
    const parentError = {
        ...error,
        data: {...error.data, pointer: parentPointer},
    } as JSLErrors.Error;
    const parentParams = {...params, error: parentError};

    if (form.getFieldState(nameFromRoot)) {
        const message =
            extractMessage(error.data.schema.nodeParameters?.errorMessages, error) ||
            extractMessage(getInstanceSchema(params)?.nodeParameters?.errorMessages, error) ||
            extractMessage(getInstanceSchema(parentParams)?.nodeParameters?.errorMessages, error) ||
            extractMessage(state.errorMessages, error) ||
            error.message;

        setJSLError(nameFromRoot, message);
    } else {
        parseError(parentParams);
    }
};

const parseNPError = ({
    allValues,
    error,
    headName,
    setNPError,
    setWaiter,
    state,
}: ParseErrorParams) => {
    if (error.code !== 'node-parameters-error') {
        return;
    }

    const nameFromRoot = getNameFromRoot(headName, error.data.pointer);
    const params = omit(error.data, 'pointer') as Omit<ValidationWaiter, 'promise'>;
    const cache = state.cache[nameFromRoot];
    const cacheItem = cache?.find((c) => isEqual(params, omit(c, 'result')));
    const waiter = state.waiters[nameFromRoot];

    if (cacheItem) {
        setNPError(nameFromRoot, cacheItem.result);

        return;
    }

    if (!waiter || !isEqual(params, omit(waiter, 'promise'))) {
        const errorOrPromise = params.validator(params.value, allValues);

        if (errorOrPromise instanceof Promise) {
            const w = {...params, promise: errorOrPromise};

            setWaiter(nameFromRoot, w);

            errorOrPromise.then((result) => {
                // eslint-disable-next-line no-param-reassign
                state.cache[nameFromRoot] = [
                    ...(state.cache[nameFromRoot] || []),
                    {...params, result},
                ];

                if (state.waiters[nameFromRoot] === w) {
                    // eslint-disable-next-line no-param-reassign
                    state.waiters[nameFromRoot] = undefined;

                    state.runValidate();
                }
            });
        } else {
            setNPError(nameFromRoot, errorOrPromise);
        }
    }
};

const parseNotError = (params: ParseErrorParams) => {
    const {error, headName, setJSLError, state} = params;

    if (error.code !== 'not-error') {
        return;
    }

    const nameFromRoot = getNameFromRoot(headName, error.data.pointer);

    const message =
        extractMessage(error.data.not.nodeParameters?.errorMessages, error) ||
        extractMessage(error.data.schema.nodeParameters?.errorMessages, error) ||
        extractMessage(getInstanceSchema(params)?.nodeParameters?.errorMessages, error) ||
        extractMessage(state.errorMessages, error) ||
        error.message;

    setJSLError(nameFromRoot, message);
};

const parseOneOfError = (params: ParseErrorParams) => {
    const {error, headName, setJSLError, state} = params;

    if (error.code !== 'one-of-error') {
        return;
    }

    const nameFromRoot = getNameFromRoot(headName, error.data.pointer);

    const message =
        extractMessage(error.data.schema.nodeParameters?.errorMessages, error) ||
        extractMessage(getInstanceSchema(params)?.nodeParameters?.errorMessages, error);

    if (message) {
        setJSLError(nameFromRoot, message);
    } else {
        const firstError = error.data.errors[0];
        const parser = getParser(firstError.code);

        if (parser) {
            parser({...params, error: firstError});
        } else {
            setJSLError(nameFromRoot, extractMessage(state.errorMessages, error) || error.message);
        }
    }
};

const parseRequiredPropertyError = (params: ParseErrorParams) => {
    const {error, form, headName, setJSLError, state} = params;

    if (error.code !== 'required-property-error') {
        return;
    }

    const propertyPointer = `${error.data.pointer}/${error.data.key}`;
    const propertyNameFromRoot = getNameFromRoot(headName, propertyPointer);
    const propertyError = {
        ...error,
        data: {...error.data, pointer: propertyPointer},
    } as JSLErrors.Error;
    const propertyParams = {...params, error: propertyError};

    if (form.getFieldState(propertyNameFromRoot)) {
        const message =
            extractMessage(error.data.schema.nodeParameters?.errorMessages, propertyError) ||
            extractMessage(
                getInstanceSchema(propertyParams)?.nodeParameters?.errorMessages,
                propertyError,
            ) ||
            extractMessage(
                getInstanceSchema(params)?.nodeParameters?.errorMessages,
                propertyError,
            ) ||
            extractMessage(state.errorMessages, propertyError) ||
            propertyError.message;

        setJSLError(propertyNameFromRoot, message);
    } else {
        parseError(params);
    }
};

const parseUniqueItemsError = (params: ParseErrorParams) => {
    const {error} = params;

    if (error.code !== 'unique-items-error') {
        return;
    }

    const parentError = {
        ...error,
        data: {...error.data, pointer: error.data.arrayPointer},
    } as JSLErrors.Error;
    const parentParams = {...params, error: parentError};

    parseError(parentParams);
};

export function getParser(code: JSLErrors.ErrorCode) {
    const parserByCode: Record<JSLErrors.ErrorCode, (params: ParseErrorParams) => void> = {
        'additional-items-error': parseAdditionalItemsError,
        'any-of-error': parseError,
        'const-error': parseError,
        'contains-any-error': parseError,
        'contains-min-error': parseSchemaContainsError,
        'enum-error': parseError,
        'exclusive-maximum-error': parseError,
        'exclusive-minimum-error': parseError,
        'invalid-property-name-error': parseInvalidPropertyNameError,
        'max-items-error': parseError,
        'max-length-error': parseError,
        'max-properties-error': parseError,
        'maximum-error': parseError,
        'min-items-error': parseError,
        'min-length-error': parseError,
        'min-properties-error': parseError,
        'minimum-error': parseError,
        'missing-dependency-error': parseMissingDependencyError,
        'multiple-of-error': parseError,
        'no-additional-properties-error': parseAdditionalPropertiesError,
        'node-parameters-error': parseNPError,
        'not-error': parseNotError,
        'one-of-error': parseOneOfError,
        'pattern-error': parseError,
        'required-property-error': parseRequiredPropertyError,
        'type-error': parseError,
        'unique-items-error': parseUniqueItemsError,
    };

    return parserByCode[code];
}
