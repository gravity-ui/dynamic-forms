import type {ErrorObject} from 'ajv';

import {JsonSchemaType} from '../../../constants';
import type {JsonSchema} from '../../../types';

import {
    AJV_MESSAGES,
    GLOBAL_ERROR_MESSAGES,
    KEYWORD_SCHEMA_ERROR_MESSAGES,
    SCHEMA_ERROR_MESSAGES,
    createProcessAjvError,
} from './fixtures.test';

describe('processAjvError', () => {
    test('error by schema path (keyword like schema)', () => {
        const schema: JsonSchema = {
            type: JsonSchemaType.Object,
            properties: {
                labels: {
                    type: JsonSchemaType.Array,
                    contains: {
                        type: JsonSchemaType.String,
                        entityParameters: {
                            errorMessages: {contains: KEYWORD_SCHEMA_ERROR_MESSAGES.contains},
                        },
                    },
                },
            },
        };
        const error: ErrorObject = {
            keyword: 'contains',
            // just to check that the instance path is ignored
            instancePath: '/incorrect-path',
            schemaPath: '#/properties/labels/contains',
            params: {type: JsonSchemaType.Array},
            message: AJV_MESSAGES.contains,
        };

        const {processAjvError, onError} = createProcessAjvError();

        processAjvError({error, schema});

        expect(onError).toHaveBeenCalledWith({
            path: ['incorrect-path'],
            error: KEYWORD_SCHEMA_ERROR_MESSAGES.contains,
        });
    });

    test('error by schema path (keyword is not schema)', () => {
        const schema: JsonSchema = {
            type: JsonSchemaType.Object,
            properties: {
                labels: {
                    type: JsonSchemaType.Array,
                    contains: true,
                    entityParameters: {
                        errorMessages: {contains: SCHEMA_ERROR_MESSAGES.contains},
                    },
                },
            },
        };
        const error: ErrorObject = {
            keyword: 'contains',
            // just to check that the instance path is ignored
            instancePath: '/incorrect-path',
            schemaPath: '#/properties/labels/contains',
            params: {type: JsonSchemaType.Array},
            message: AJV_MESSAGES.contains,
        };

        const {processAjvError, onError} = createProcessAjvError();

        processAjvError({error, schema});

        expect(onError).toHaveBeenCalledWith({
            path: ['incorrect-path'],
            error: SCHEMA_ERROR_MESSAGES.contains,
        });
    });

    test('error by instance path', () => {
        const schema: JsonSchema = {
            type: JsonSchemaType.Object,
            properties: {
                labels: {
                    type: JsonSchemaType.Array,
                    contains: true,
                    entityParameters: {
                        errorMessages: {contains: SCHEMA_ERROR_MESSAGES.contains},
                    },
                },
            },
        };
        const error: ErrorObject = {
            keyword: 'contains',
            instancePath: '/labels',
            // just to check that the schema path is ignored
            schemaPath: '#/incorrect-path',
            params: {type: JsonSchemaType.Array},
            message: AJV_MESSAGES.contains,
        };

        const {processAjvError, onError} = createProcessAjvError();

        processAjvError({error, schema});

        expect(onError).toHaveBeenCalledWith({
            path: ['labels'],
            error: SCHEMA_ERROR_MESSAGES.contains,
        });
    });

    test('error by global error messages', () => {
        // just to check that the schema is ignored
        const schema: JsonSchema = {};
        const error: ErrorObject = {
            keyword: 'contains',
            instancePath: '/labels',
            schemaPath: '#/properties/labels/contains',
            params: {type: JsonSchemaType.Array},
            message: AJV_MESSAGES.contains,
        };

        const {processAjvError, onError} = createProcessAjvError();

        processAjvError({error, schema, errorMessages: GLOBAL_ERROR_MESSAGES});

        expect(onError).toHaveBeenCalledWith({
            path: ['labels'],
            error: GLOBAL_ERROR_MESSAGES.contains,
        });
    });

    test('error by ajv', () => {
        const schema: JsonSchema = {
            type: JsonSchemaType.Object,
            properties: {
                labels: {
                    type: JsonSchemaType.Array,
                    contains: {type: JsonSchemaType.String},
                },
            },
        };
        const error: ErrorObject = {
            keyword: 'contains',
            instancePath: '/labels',
            schemaPath: '#/properties/labels/contains',
            params: {type: JsonSchemaType.Array},
            message: AJV_MESSAGES.contains,
        };

        const {processAjvError, onError} = createProcessAjvError();

        processAjvError({error, schema});

        expect(onError).toHaveBeenCalledWith({path: ['labels'], error: AJV_MESSAGES.contains});
    });

    test('error messages with object', () => {
        const schema: JsonSchema = {
            type: JsonSchemaType.Object,
            required: ['a'],
            entityParameters: {errorMessages: {required: {a: SCHEMA_ERROR_MESSAGES.required}}},
        };
        const error: ErrorObject = {
            keyword: 'required',
            instancePath: '',
            schemaPath: '#/required',
            params: {missingProperty: 'a'},
            message: AJV_MESSAGES.required('a'),
        };

        const {processAjvError, onError} = createProcessAjvError();

        processAjvError({error, schema});

        expect(onError).toHaveBeenCalledWith({path: ['a'], error: SCHEMA_ERROR_MESSAGES.required});
    });
});
