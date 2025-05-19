import {JsonSchemaType} from '../../../constants';
import type {ValidationState} from '../../../mutators';
import type {JsonSchemaString, ObjectValue} from '../../../types';
import type {EntityParametersError} from '../../types';
import {processEntityParametersError} from '../process-entity-parameters-error';

describe('SchemaRendererServiceField/utils/process-entity-parameters-error', () => {
    const fieldName = 'field';
    const fieldInstancePath = `/${fieldName}`;
    const fieldValue = 'field value';
    const fieldValidateResult = 'field validate result';
    const fieldSchema: JsonSchemaString = {type: JsonSchemaType.String};
    const fieldValidator = jest.fn();
    const fieldEntityParametersError: EntityParametersError = {
        instancePath: fieldInstancePath,
        keyword: 'entityParameters',
        schemaPath: '#/entityParameters',
        params: {
            schema: fieldSchema,
            validator: fieldValidator,
            value: fieldValue,
        },
    };

    const headName = 'headName';
    const allValues: ObjectValue = {[headName]: {[fieldName]: fieldValue}};
    const onError = jest.fn();
    const onAsyncError = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('with cache hit', () => {
        const validationState: ValidationState = {
            cache: {
                [fieldInstancePath]: [
                    {
                        schema: fieldSchema,
                        validator: fieldValidator,
                        value: fieldValue,
                        result: fieldValidateResult,
                    },
                ],
            },
        };

        it('should call onError with cached result', () => {
            processEntityParametersError({
                allValues,
                error: fieldEntityParametersError,
                headName,
                onAsyncError,
                onError,
                validationState,
            });

            expect(onError).toHaveBeenCalledWith({
                error: fieldValidateResult,
                path: [headName, fieldName],
            });
            expect(fieldValidator).not.toHaveBeenCalled();
            expect(onAsyncError).not.toHaveBeenCalled();
        });
    });

    describe('with no cache and no waiter', () => {
        const validationState: ValidationState = {};

        it('should call validator and onError with synchronous result', () => {
            fieldValidator.mockReturnValue(fieldValidateResult);

            processEntityParametersError({
                allValues,
                error: fieldEntityParametersError,
                headName,
                onAsyncError,
                onError,
                validationState,
            });

            expect(fieldValidator).toHaveBeenCalledWith(fieldValue, allValues);
            expect(onError).toHaveBeenCalledWith({
                error: fieldValidateResult,
                path: [headName, fieldName],
            });
            expect(onAsyncError).not.toHaveBeenCalled();
        });

        it('should call validator and onAsyncError with asynchronous result', () => {
            const promise = Promise.resolve(fieldValidateResult);

            fieldValidator.mockReturnValue(promise);

            processEntityParametersError({
                allValues,
                error: fieldEntityParametersError,
                headName,
                onAsyncError,
                onError,
                validationState,
            });

            expect(fieldValidator).toHaveBeenCalledWith(fieldValue, allValues);
            expect(onAsyncError).toHaveBeenCalledWith({
                instancePath: fieldInstancePath,
                params: fieldEntityParametersError.params,
                promise,
            });
            expect(onError).not.toHaveBeenCalled();
        });
    });

    describe('with waiter that does not match error params', () => {
        const validationState: ValidationState = {
            waiters: {
                [fieldInstancePath]: {
                    schema: fieldSchema,
                    validator: jest.fn(),
                    value: 'different value',
                },
            },
        };

        it('should call validator and onError with synchronous result', () => {
            fieldValidator.mockReturnValue(fieldValidateResult);

            processEntityParametersError({
                allValues,
                error: fieldEntityParametersError,
                headName,
                onAsyncError,
                onError,
                validationState,
            });

            expect(fieldValidator).toHaveBeenCalledWith(fieldValue, allValues);
            expect(onError).toHaveBeenCalledWith({
                error: fieldValidateResult,
                path: [headName, fieldName],
            });
            expect(onAsyncError).not.toHaveBeenCalled();
        });

        it('should call validator and onAsyncError with asynchronous result', () => {
            const promise = Promise.resolve(fieldValidateResult);

            fieldValidator.mockReturnValue(promise);

            processEntityParametersError({
                allValues,
                error: fieldEntityParametersError,
                headName,
                onAsyncError,
                onError,
                validationState,
            });

            expect(fieldValidator).toHaveBeenCalledWith(fieldValue, allValues);
            expect(onAsyncError).toHaveBeenCalledWith({
                instancePath: fieldInstancePath,
                params: fieldEntityParametersError.params,
                promise,
            });
            expect(onError).not.toHaveBeenCalled();
        });
    });

    describe('with matching waiter', () => {
        const validationState: ValidationState = {
            waiters: {
                [fieldInstancePath]: {
                    schema: fieldSchema,
                    validator: fieldValidator,
                    value: fieldValue,
                },
            },
        };

        it('should not call validator, onError, or onAsyncError', () => {
            processEntityParametersError({
                allValues,
                error: fieldEntityParametersError,
                headName,
                onAsyncError,
                onError,
                validationState,
            });

            expect(fieldValidator).not.toHaveBeenCalled();
            expect(onError).not.toHaveBeenCalled();
            expect(onAsyncError).not.toHaveBeenCalled();
        });
    });

    describe('with undefined validationState', () => {
        it('should call validator and onError with synchronous result', () => {
            fieldValidator.mockReturnValue(fieldValidateResult);

            processEntityParametersError({
                allValues,
                error: fieldEntityParametersError,
                headName,
                onAsyncError,
                onError,
                validationState: undefined,
            });

            expect(fieldValidator).toHaveBeenCalledWith(fieldValue, allValues);
            expect(onError).toHaveBeenCalledWith({
                error: fieldValidateResult,
                path: [headName, fieldName],
            });
            expect(onAsyncError).not.toHaveBeenCalled();
        });

        it('should call validator and onAsyncError with asynchronous result', () => {
            const promise = Promise.resolve(fieldValidateResult);

            fieldValidator.mockReturnValue(promise);

            processEntityParametersError({
                allValues,
                error: fieldEntityParametersError,
                headName,
                onAsyncError,
                onError,
                validationState: undefined,
            });

            expect(fieldValidator).toHaveBeenCalledWith(fieldValue, allValues);
            expect(onAsyncError).toHaveBeenCalledWith({
                instancePath: fieldInstancePath,
                params: fieldEntityParametersError.params,
                promise,
            });
            expect(onError).not.toHaveBeenCalled();
        });
    });
});
