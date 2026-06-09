import {JsonSchemaType} from '../../../constants';
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
        const {validate, setArrayObjectErrors, setAsyncValidationCache, setAsyncValidationWaiters} =
            createValidate();

        const result = validate(1);

        expect(result).toBe(false);
        expect(setArrayObjectErrors).not.toHaveBeenCalled();
        expect(setAsyncValidationCache).not.toHaveBeenCalled();
        expect(setAsyncValidationWaiters).not.toHaveBeenCalled();
    });

    test('return error if schema is not valid (AJV error)', () => {
        const schema: JsonSchema = {type: JsonSchemaType.String};

        const {validate, setArrayObjectErrors, setAsyncValidationCache, setAsyncValidationWaiters} =
            createValidate();

        const result = validate(1, {schema});

        expect(result).toBe(AJV_MESSAGES.typeString);
        expect(setArrayObjectErrors).toHaveBeenCalledWith({
            headName: FIELD_NAME,
            arrayAndObjectErrors: {},
        });
        expect(setAsyncValidationCache).not.toHaveBeenCalled();
        expect(setAsyncValidationWaiters).not.toHaveBeenCalled();
    });

    test('return error if schema is not valid (entity parameters error)', () => {
        const schema: JsonSchema = {
            type: JsonSchemaType.String,
            entityParameters: {validatorType: CUSTOM_VALIDATOR_WITH_ERROR_TYPE},
        };

        const {validate, setArrayObjectErrors, setAsyncValidationCache, setAsyncValidationWaiters} =
            createValidate();

        const result = validate('1', {schema});

        expect(result).toBe(CUSTOM_VALIDATOR_WITH_ERROR_MESSAGE);
        expect(setArrayObjectErrors).toHaveBeenCalledWith({
            headName: FIELD_NAME,
            arrayAndObjectErrors: {},
        });
        expect(setAsyncValidationCache).not.toHaveBeenCalled();
        expect(setAsyncValidationWaiters).not.toHaveBeenCalled();
    });

    test('return error if schema is not valid (external regular error)', () => {
        const schema: JsonSchema = {type: JsonSchemaType.String};
        const regularError = 'regular-error';

        const {validate, setArrayObjectErrors, setAsyncValidationCache, setAsyncValidationWaiters} =
            createValidate();

        const result = validate('1', {schema, regularErrors: {[FIELD_NAME]: regularError}});

        expect(result).toBe(regularError);
        expect(setArrayObjectErrors).toHaveBeenCalledWith({
            headName: FIELD_NAME,
            arrayAndObjectErrors: {},
        });
        expect(setAsyncValidationCache).not.toHaveBeenCalled();
        expect(setAsyncValidationWaiters).not.toHaveBeenCalled();
    });

    test('return error if schema is not valid (external priority error)', () => {
        const schema: JsonSchema = {type: JsonSchemaType.String};
        const priorityError = 'priority-error';

        const {validate, setArrayObjectErrors, setAsyncValidationCache, setAsyncValidationWaiters} =
            createValidate();

        const result = validate('1', {schema, priorityErrors: {[FIELD_NAME]: priorityError}});

        expect(result).toBe(priorityError);
        expect(setArrayObjectErrors).toHaveBeenCalledWith({
            headName: FIELD_NAME,
            arrayAndObjectErrors: {},
        });
        expect(setAsyncValidationCache).not.toHaveBeenCalled();
        expect(setAsyncValidationWaiters).not.toHaveBeenCalled();
    });

    test('return true if only array and object errors', () => {
        const schema: JsonSchema = {type: JsonSchemaType.Array};

        const {validate, setArrayObjectErrors, setAsyncValidationCache, setAsyncValidationWaiters} =
            createValidate();

        const result = validate('1', {schema});

        expect(result).toBe(true);
        expect(setAsyncValidationCache).not.toHaveBeenCalled();
        expect(setAsyncValidationWaiters).not.toHaveBeenCalled();
        expect(setArrayObjectErrors).toHaveBeenCalledWith({
            headName: FIELD_NAME,
            arrayAndObjectErrors: {[FIELD_NAME]: AJV_MESSAGES.typeArray},
        });
    });

    test('call setAsyncValidationWaiters if has waiters', () => {
        const schema: JsonSchema = {
            type: JsonSchemaType.String,
            entityParameters: {validatorType: CUSTOM_ASYNC_VALIDATOR_WITH_ERROR_TYPE},
        };
        const value = '1';

        const {validate, setArrayObjectErrors, setAsyncValidationCache, setAsyncValidationWaiters} =
            createValidate();

        const result = validate(value, {schema});

        expect(result).toBe(false);
        expect(setAsyncValidationCache).not.toHaveBeenCalled();
        expect(setAsyncValidationWaiters).toHaveBeenCalledWith({
            headName: FIELD_NAME,
            waiters: {'': {schema: schema, validator: customAsyncValidatorWithError, value}},
        });
        expect(setArrayObjectErrors).toHaveBeenCalledWith({
            headName: FIELD_NAME,
            arrayAndObjectErrors: {},
        });
    });

    test('no call setArrayObjectErrors if state is the same', () => {
        const schema: JsonSchema = {type: JsonSchemaType.Array};

        const {validate, setArrayObjectErrors, setAsyncValidationCache, setAsyncValidationWaiters} =
            createValidate();

        const result = validate('1', {
            schema,
            arrayAndObjectErrors: {[FIELD_NAME]: AJV_MESSAGES.typeArray},
        });

        expect(result).toBe(true);
        expect(setAsyncValidationCache).not.toHaveBeenCalled();
        expect(setAsyncValidationWaiters).not.toHaveBeenCalled();
        expect(setArrayObjectErrors).not.toHaveBeenCalled();
    });

    test('AJV errors have priority over external regular errors', () => {
        const schema: JsonSchema = {type: JsonSchemaType.String};
        const regularError = 'regular-error';

        const {validate, setArrayObjectErrors, setAsyncValidationCache, setAsyncValidationWaiters} =
            createValidate();

        const result = validate(1, {schema, regularErrors: {[FIELD_NAME]: regularError}});

        expect(result).toBe(AJV_MESSAGES.typeString);
        expect(setArrayObjectErrors).toHaveBeenCalledWith({
            headName: FIELD_NAME,
            arrayAndObjectErrors: {},
        });
        expect(setAsyncValidationCache).not.toHaveBeenCalled();
        expect(setAsyncValidationWaiters).not.toHaveBeenCalled();
    });

    test('entity parameters error has priority over AJV errors', () => {
        const schema: JsonSchema = {
            type: JsonSchemaType.String,
            entityParameters: {validatorType: CUSTOM_VALIDATOR_WITH_ERROR_TYPE},
        };

        const {validate, setArrayObjectErrors, setAsyncValidationCache, setAsyncValidationWaiters} =
            createValidate();

        const result = validate(1, {schema});

        expect(result).toBe(CUSTOM_VALIDATOR_WITH_ERROR_MESSAGE);
        expect(setArrayObjectErrors).toHaveBeenCalledWith({
            headName: FIELD_NAME,
            arrayAndObjectErrors: {},
        });
        expect(setAsyncValidationCache).not.toHaveBeenCalled();
        expect(setAsyncValidationWaiters).not.toHaveBeenCalled();
    });

    test('external priority errors have priority over entity parameters errors', () => {
        const schema: JsonSchema = {
            type: JsonSchemaType.String,
            entityParameters: {validatorType: CUSTOM_VALIDATOR_WITH_ERROR_TYPE},
        };
        const priorityError = 'priority-error';

        const {validate, setArrayObjectErrors, setAsyncValidationCache, setAsyncValidationWaiters} =
            createValidate();

        const result = validate('1', {schema, priorityErrors: {[FIELD_NAME]: priorityError}});

        expect(result).toBe(priorityError);
        expect(setArrayObjectErrors).toHaveBeenCalledWith({
            headName: FIELD_NAME,
            arrayAndObjectErrors: {},
        });
        expect(setAsyncValidationCache).not.toHaveBeenCalled();
        expect(setAsyncValidationWaiters).not.toHaveBeenCalled();
    });

    test('recompute ajvValidate if schema is different', () => {
        const schema: JsonSchema = {type: JsonSchemaType.String};
        const schema2: JsonSchema = {type: JsonSchemaType.Number};

        const {validate} = createValidate();

        expect(validate('1', {schema})).toBe(false);
        expect(validate('1', {schema: schema2})).toBe(AJV_MESSAGES.typeNumber);
    });
});
