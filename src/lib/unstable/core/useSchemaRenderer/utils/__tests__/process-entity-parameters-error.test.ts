import type {EntityParametersError} from '../../types';

import {
    CUSTOM_VALIDATOR_WITH_ERROR_MESSAGE,
    createProcessEntityParametersError,
    customAsyncValidatorWithError,
    customValidatorWithError,
} from './fixtures.test';

describe('processEntityParametersError', () => {
    test('result is returned from the cache', () => {
        const value = 'jajaja';
        const validator = jest.fn();
        const result = 'validation-result';
        const error: EntityParametersError = {
            keyword: 'entityParameters',
            instancePath: '',
            schemaPath: '#/entityParameters',
            params: {validator, value, schema: {}},
            message: '',
        };
        const validationState = {cache: {'': [{validator, value, schema: {}, result}]}};

        const {processEntityParametersError, onError} = createProcessEntityParametersError();

        processEntityParametersError({error, validationState});

        expect(validator).not.toHaveBeenCalled();
        expect(onError).toHaveBeenCalledWith({path: [], error: result});
    });

    test('already had a waiter', () => {
        const value = 'jajaja';
        const validator = jest.fn();
        const error: EntityParametersError = {
            keyword: 'entityParameters',
            instancePath: '',
            schemaPath: '#/entityParameters',
            params: {validator, value, schema: {}},
            message: '',
        };
        const validationState = {waiters: {'': {validator, value, schema: {}}}};

        const {processEntityParametersError, onAsyncError, onError} =
            createProcessEntityParametersError();

        processEntityParametersError({error, validationState});

        expect(validator).not.toHaveBeenCalled();
        expect(onAsyncError).not.toHaveBeenCalled();
        expect(onError).not.toHaveBeenCalled();
    });

    test('already had a waiter, but the params are different', () => {
        const value = 'jajaja';
        const allValues = {ja: value};
        const validator = jest.fn(customValidatorWithError);
        const error: EntityParametersError = {
            keyword: 'entityParameters',
            instancePath: '',
            schemaPath: '#/entityParameters',
            params: {validator, value, schema: {}},
            message: '',
        };
        const validationState = {waiters: {'': {validator, value: 'another-value', schema: {}}}};

        const {processEntityParametersError, onError} = createProcessEntityParametersError();

        processEntityParametersError({error, allValues, validationState});

        expect(validator).toHaveBeenCalledWith(value, allValues);
        expect(onError).toHaveBeenCalledWith({
            path: [],
            error: CUSTOM_VALIDATOR_WITH_ERROR_MESSAGE,
        });
    });

    test('sync validator error is returned', () => {
        const value = 'jajaja';
        const allValues = {ja: value};
        const validator = jest.fn(customValidatorWithError);
        const error: EntityParametersError = {
            keyword: 'entityParameters',
            instancePath: '',
            schemaPath: '#/entityParameters',
            params: {validator, value, schema: {}},
            message: '',
        };

        const {processEntityParametersError, onError} = createProcessEntityParametersError();

        processEntityParametersError({error, allValues});

        expect(validator).toHaveBeenCalledWith(value, allValues);
        expect(onError).toHaveBeenCalledWith({
            path: [],
            error: CUSTOM_VALIDATOR_WITH_ERROR_MESSAGE,
        });
    });

    test('async validator error is returned', () => {
        const value = 'jajaja';
        const allValues = {ja: value};
        const validator = jest.fn(customAsyncValidatorWithError);
        const error: EntityParametersError = {
            keyword: 'entityParameters',
            instancePath: '',
            schemaPath: '#/entityParameters',
            params: {validator, value, schema: {}},
            message: '',
        };

        const {processEntityParametersError, onAsyncError} = createProcessEntityParametersError();

        processEntityParametersError({error, allValues});

        expect(validator).toHaveBeenCalledWith(value, allValues);
        expect(onAsyncError).toHaveBeenCalledWith({
            instancePath: '',
            params: {validator, value, schema: {}},
            promise: validator.mock.results[0].value,
        });
    });
});
