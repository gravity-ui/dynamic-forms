import {EntityType, JsonSchemaType} from '../../../constants';
import type {JsonSchema} from '../../../types';

import {
    AJV_MESSAGES,
    CUSTOM_ASYNC_VALIDATOR_WITH_ERROR_TYPE,
    CUSTOM_VALIDATOR_WITH_ERROR_MESSAGE,
    CUSTOM_VALIDATOR_WITH_ERROR_TYPE,
    FIELD_NAME,
    createValidate,
    customAsyncValidatorWithError,
} from './fixtures.test';

describe('getValidate', () => {
    test('returns false if no schema', () => {
        const {validate, setAsyncValidationCache, setAsyncValidationWaiters, setErrors} =
            createValidate();

        const result = validate(1);

        expect(result).toBe(false);
        expect(setAsyncValidationCache).not.toHaveBeenCalled();
        expect(setAsyncValidationWaiters).not.toHaveBeenCalled();
        expect(setErrors).not.toHaveBeenCalled();
    });

    test('return error if schema is not valid (AJV error)', () => {
        const schema: JsonSchema = {
            type: JsonSchemaType.String,
            entityParameters: {type: EntityType.String},
        };

        const {validate, setAsyncValidationCache, setAsyncValidationWaiters, setErrors} =
            createValidate();

        const result = validate(1, {schema});

        const errors = {[FIELD_NAME]: AJV_MESSAGES.typeString};

        expect(result).toEqual('error');
        expect(setAsyncValidationCache).not.toHaveBeenCalled();
        expect(setAsyncValidationWaiters).not.toHaveBeenCalled();
        expect(setErrors).toHaveBeenCalledWith(errors);
    });

    test('return error if schema is not valid (entity parameters error)', () => {
        const schema: JsonSchema = {
            entityParameters: {
                type: EntityType.String,
                validatorType: CUSTOM_VALIDATOR_WITH_ERROR_TYPE,
            },
        };

        const {validate, setAsyncValidationCache, setAsyncValidationWaiters, setErrors} =
            createValidate();

        const result = validate('1', {schema});

        const errors = {[FIELD_NAME]: CUSTOM_VALIDATOR_WITH_ERROR_MESSAGE};

        expect(result).toEqual('error');
        expect(setAsyncValidationCache).not.toHaveBeenCalled();
        expect(setAsyncValidationWaiters).not.toHaveBeenCalled();
        expect(setErrors).toHaveBeenCalledWith(errors);
    });

    test('return error if schema is not valid (external regular error)', () => {
        const schema: JsonSchema = {entityParameters: {type: EntityType.String}};
        const regularError = 'regular-error';

        const {validate, setAsyncValidationCache, setAsyncValidationWaiters, setErrors} =
            createValidate();

        const result = validate('1', {schema, regularErrors: {[FIELD_NAME]: regularError}});

        const errors = {[FIELD_NAME]: regularError};

        expect(result).toEqual('error');
        expect(setAsyncValidationCache).not.toHaveBeenCalled();
        expect(setAsyncValidationWaiters).not.toHaveBeenCalled();
        expect(setErrors).toHaveBeenCalledWith(errors);
    });

    test('return error if schema is not valid (external priority error)', () => {
        const schema: JsonSchema = {entityParameters: {type: EntityType.String}};
        const priorityError = 'priority-error';

        const {validate, setAsyncValidationCache, setAsyncValidationWaiters, setErrors} =
            createValidate();

        const result = validate('1', {schema, priorityErrors: {[FIELD_NAME]: priorityError}});

        const errors = {[FIELD_NAME]: priorityError};

        expect(result).toEqual('error');
        expect(setAsyncValidationCache).not.toHaveBeenCalled();
        expect(setAsyncValidationWaiters).not.toHaveBeenCalled();
        expect(setErrors).toHaveBeenCalledWith(errors);
    });

    test('call setAsyncValidationWaiters if has waiters', () => {
        const schema: JsonSchema = {
            entityParameters: {
                type: EntityType.String,
                validatorType: CUSTOM_ASYNC_VALIDATOR_WITH_ERROR_TYPE,
            },
        };
        const value = '1';

        const {validate, setAsyncValidationCache, setAsyncValidationWaiters, setErrors} =
            createValidate();

        const result = validate(value, {schema});

        expect(result).toBe(false);
        expect(setAsyncValidationCache).not.toHaveBeenCalled();
        expect(setAsyncValidationWaiters).toHaveBeenCalledWith({
            headName: FIELD_NAME,
            waiters: {'': {schema: schema, validator: customAsyncValidatorWithError, value}},
        });
        expect(setErrors).toHaveBeenCalledWith({});
    });

    test('AJV errors have priority over external regular errors', () => {
        const schema: JsonSchema = {
            type: JsonSchemaType.String,
            entityParameters: {type: EntityType.String},
        };
        const regularError = 'regular-error';

        const {validate, setAsyncValidationCache, setAsyncValidationWaiters, setErrors} =
            createValidate();

        const result = validate(1, {schema, regularErrors: {[FIELD_NAME]: regularError}});

        const errors = {[FIELD_NAME]: AJV_MESSAGES.typeString};

        expect(result).toEqual('error');
        expect(setAsyncValidationCache).not.toHaveBeenCalled();
        expect(setAsyncValidationWaiters).not.toHaveBeenCalled();
        expect(setErrors).toHaveBeenCalledWith(errors);
    });

    test('entity parameters error has priority over AJV errors', () => {
        const schema: JsonSchema = {
            type: JsonSchemaType.String,
            entityParameters: {
                type: EntityType.String,
                validatorType: CUSTOM_VALIDATOR_WITH_ERROR_TYPE,
            },
        };

        const {validate, setAsyncValidationCache, setAsyncValidationWaiters, setErrors} =
            createValidate();

        const result = validate(1, {schema});

        const errors = {[FIELD_NAME]: CUSTOM_VALIDATOR_WITH_ERROR_MESSAGE};

        expect(result).toEqual('error');
        expect(setAsyncValidationCache).not.toHaveBeenCalled();
        expect(setAsyncValidationWaiters).not.toHaveBeenCalled();
        expect(setErrors).toHaveBeenCalledWith(errors);
    });

    test('external priority errors have priority over entity parameters errors', () => {
        const schema: JsonSchema = {
            entityParameters: {
                type: EntityType.String,
                validatorType: CUSTOM_VALIDATOR_WITH_ERROR_TYPE,
            },
        };
        const priorityError = 'priority-error';

        const {validate, setAsyncValidationCache, setAsyncValidationWaiters, setErrors} =
            createValidate();

        const result = validate('1', {schema, priorityErrors: {[FIELD_NAME]: priorityError}});

        const errors = {[FIELD_NAME]: priorityError};

        expect(result).toEqual('error');
        expect(setAsyncValidationCache).not.toHaveBeenCalled();
        expect(setAsyncValidationWaiters).not.toHaveBeenCalled();
        expect(setErrors).toHaveBeenCalledWith(errors);
    });

    test('recompute ajvValidate if schema is different', () => {
        const schema: JsonSchema = {type: JsonSchemaType.String};
        const schema2: JsonSchema = {type: JsonSchemaType.Number};

        const {validate, setErrors} = createValidate();

        expect(validate('1', {schema})).toEqual(false);
        expect(setErrors).toHaveBeenCalledWith({});
        expect(validate('1', {schema: schema2})).toBe('error');
        expect(setErrors).toHaveBeenCalledWith({[FIELD_NAME]: AJV_MESSAGES.typeNumber});
    });
});
