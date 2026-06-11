import type {ErrorObject} from 'ajv';

import {EntityType, JsonSchemaType} from '../../../constants';
import type {JsonSchema} from '../../../types';
import type {EntityParametersError} from '../../types';

import {
    AJV_MESSAGES,
    CUSTOM_ASYNC_VALIDATOR_WITH_ERROR_MESSAGE,
    CUSTOM_ASYNC_VALIDATOR_WITH_ERROR_TYPE,
    CUSTOM_VALIDATOR_WITH_ERROR_MESSAGE,
    CUSTOM_VALIDATOR_WITH_ERROR_TYPE,
    FIELD_NAME,
    createProcessAjvValidateErrors,
    customAsyncValidatorWithError,
    customValidatorWithError,
} from './fixtures.test';

describe('processAjvValidateErrors', () => {
    test('processes ajv errors', () => {
        const schema: JsonSchema = {type: JsonSchemaType.String};
        const ajvValidateErrors: (ErrorObject | EntityParametersError)[] = [
            {
                keyword: 'type',
                instancePath: '',
                schemaPath: '#/type',
                params: {type: JsonSchemaType.String},
                message: AJV_MESSAGES.typeString,
            },
        ];

        const {processAjvValidateErrors, setAsyncValidationCache} =
            createProcessAjvValidateErrors();

        const {ajvErrorItems, entityParametersErrorItems, waiters} = processAjvValidateErrors({
            ajvValidateErrors,
            schema,
        });

        expect(ajvErrorItems).toEqual([{path: [], error: AJV_MESSAGES.typeString}]);
        expect(entityParametersErrorItems).toEqual([]);
        expect(waiters).toEqual({});
        expect(setAsyncValidationCache).not.toHaveBeenCalled();
    });

    test('processes entity parameters sync errors', () => {
        const schema: JsonSchema = {
            entityParameters: {
                type: EntityType.String,
                validatorType: CUSTOM_VALIDATOR_WITH_ERROR_TYPE,
            },
        };
        const ajvValidateErrors: (ErrorObject | EntityParametersError)[] = [
            {
                keyword: 'entityParameters',
                instancePath: '',
                schemaPath: '#/entityParameters',
                params: {validator: customValidatorWithError, value: 'jajaja', schema},
                message: '',
            },
        ];

        const {processAjvValidateErrors, setAsyncValidationCache} =
            createProcessAjvValidateErrors();

        const {ajvErrorItems, entityParametersErrorItems, waiters} = processAjvValidateErrors({
            ajvValidateErrors,
            schema,
        });

        expect(ajvErrorItems).toEqual([]);
        expect(entityParametersErrorItems).toEqual([
            {path: [], error: CUSTOM_VALIDATOR_WITH_ERROR_MESSAGE},
        ]);
        expect(waiters).toEqual({});
        expect(setAsyncValidationCache).not.toHaveBeenCalled();
    });

    test('processes entity parameters async errors', async () => {
        const schema: JsonSchema = {
            type: JsonSchemaType.String,
            entityParameters: {validatorType: CUSTOM_ASYNC_VALIDATOR_WITH_ERROR_TYPE},
        };
        const value = 'jajaja';
        const ajvValidateErrors: (ErrorObject | EntityParametersError)[] = [
            {
                keyword: 'entityParameters',
                instancePath: '',
                schemaPath: '#/entityParameters',
                params: {validator: customAsyncValidatorWithError, value, schema},
                message: '',
            },
        ];

        const {processAjvValidateErrors, setAsyncValidationCache} =
            createProcessAjvValidateErrors();

        const {ajvErrorItems, entityParametersErrorItems, waiters} = processAjvValidateErrors({
            ajvValidateErrors,
            schema,
        });

        expect(ajvErrorItems).toEqual([]);
        expect(entityParametersErrorItems).toEqual([]);
        expect(waiters).toEqual({'': {validator: customAsyncValidatorWithError, value, schema}});

        await customAsyncValidatorWithError();

        expect(setAsyncValidationCache).toHaveBeenCalledWith({
            headName: FIELD_NAME,
            cache: {
                '': {
                    validator: customAsyncValidatorWithError,
                    value,
                    schema,
                    result: CUSTOM_ASYNC_VALIDATOR_WITH_ERROR_MESSAGE,
                },
            },
        });
    });
});
