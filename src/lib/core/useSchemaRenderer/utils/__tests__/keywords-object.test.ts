import {createForm} from 'final-form';

import {JsonSchemaType} from '../../../constants';
import type {JSLErrors, JsonSchema, JsonSchemaObject} from '../../../types';
import {getSchemaRootNode} from '../get-schema-root-node';
import {type ParseErrorParams, getParser} from '../parse-errors';

describe('validate objects', () => {
    describe('additionalProperties (boolean)', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                properties: {a: {type: JsonSchemaType.String}},
                additionalProperties: false,
            };
            const value = {a: 'x'};
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                properties: {a: {type: JsonSchemaType.String}},
                additionalProperties: false,
            };
            const value = {a: 'x', extra: 1};
            const error: JSLErrors.AdditionalProperties = {
                type: 'error',
                code: 'no-additional-properties-error',
                message: 'Additional property `extra` in `#/extra` is not allowed',
                data: {
                    pointer: '#/extra',
                    schema,
                    value,
                    property: 'extra',
                    properties: ['a'],
                },
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        test('get-parser: default error message', () => {
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                properties: {a: {type: JsonSchemaType.String}},
                additionalProperties: false,
            };
            const value = {a: 'x', extra: 1};
            const error: JSLErrors.AdditionalProperties = {
                type: 'error',
                code: 'no-additional-properties-error',
                message: 'Additional property `extra` in `#/extra` is not allowed',
                data: {
                    pointer: '#/extra',
                    schema,
                    value,
                    property: 'extra',
                    properties: ['a'],
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('extra', () => {}, {}, {});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('extra', error.message);
        });

        test('get-parser: error schema-level error message', () => {
            const message = 'additionalProperties error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                properties: {
                    a: {
                        type: JsonSchemaType.String,
                        nodeParameters: {
                            errorMessages: {additionalProperties: 'another error message'},
                        },
                    },
                },
                additionalProperties: false,
                nodeParameters: {errorMessages: {additionalProperties: message}},
            };
            const value = {a: 'x', extra: 1};
            const error: JSLErrors.AdditionalProperties = {
                type: 'error',
                code: 'no-additional-properties-error',
                message: 'Additional property `extra` in `#/extra` is not allowed',
                data: {
                    pointer: '#/extra',
                    schema,
                    value,
                    property: 'extra',
                    properties: ['a'],
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('extra', () => {}, {}, {});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {
                    schema,
                    errorMessages: {additionalProperties: 'global error message'},
                },
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('extra', message);
        });

        test('get-parser: instance schema-level error message', () => {
            const message = 'additionalProperties error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                properties: {a: {nodeParameters: {errorMessages: {additionalProperties: message}}}},
                allOf: [
                    {properties: {a: {type: JsonSchemaType.String}}, additionalProperties: false},
                ],
            };
            const value = {a: 'x', extra: 1};
            const error: JSLErrors.AdditionalProperties = {
                type: 'error',
                code: 'no-additional-properties-error',
                message: 'Additional property `extra` in `#/extra` is not allowed',
                data: {
                    pointer: '#/extra',
                    schema: schema.allOf![0],
                    value,
                    property: 'extra',
                    properties: ['a'],
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm<any>({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('extra', () => {}, {}, {data: {schemaPath: '#/properties/a'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {additionalProperties: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('extra', message);
        });

        test('get-parser: parent instance schema-level error message', () => {
            const message = 'additionalProperties error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                allOf: [
                    {
                        properties: {a: {type: JsonSchemaType.String}},
                        additionalProperties: false,
                    },
                ],
                nodeParameters: {errorMessages: {additionalProperties: message}},
            };
            const value = {a: 'x', extra: 1};
            const error: JSLErrors.AdditionalProperties = {
                type: 'error',
                code: 'no-additional-properties-error',
                message: 'Additional property `extra` in `#/extra` is not allowed',
                data: {
                    pointer: '#/extra',
                    schema: schema.allOf![0],
                    value,
                    property: 'extra',
                    properties: ['a'],
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm<any>({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('', () => {}, {}, {data: {schemaPath: '#'}});
            form.registerField<any>('extra', () => {}, {}, {data: {schemaPath: '#/properties/a'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {
                    schema,
                    errorMessages: {additionalProperties: 'global error message'},
                },
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('extra', message);
        });

        test('get-parser: global error message', () => {
            const message = 'additionalProperties error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                properties: {a: {type: JsonSchemaType.String}},
                additionalProperties: false,
            };
            const value = {a: 'x', extra: 1};
            const error: JSLErrors.AdditionalProperties = {
                type: 'error',
                code: 'no-additional-properties-error',
                message: 'Additional property `extra` in `#/extra` is not allowed',
                data: {
                    pointer: '#/extra',
                    schema,
                    value,
                    property: 'extra',
                    properties: ['a'],
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm<any>({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('extra', () => {}, {}, {data: {schemaPath: '#/properties/a'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {additionalProperties: message}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('extra', message);
        });

        test('get-parser: parent default error message (pointer field not registered)', () => {
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                properties: {a: {type: JsonSchemaType.String}},
                additionalProperties: false,
            };
            const value = {a: 'x', extra: 1};
            const error: JSLErrors.AdditionalProperties = {
                type: 'error',
                code: 'no-additional-properties-error',
                message: 'Additional property `extra` in `#/extra` is not allowed',
                data: {
                    pointer: '#/extra',
                    schema,
                    value,
                    property: 'extra',
                    properties: ['a'],
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', error.message);
        });

        test('get-parser: parent error schema-level error message (pointer field not registered)', () => {
            const message = 'additionalProperties error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                properties: {a: {type: JsonSchemaType.String}},
                additionalProperties: false,
                nodeParameters: {errorMessages: {additionalProperties: message}},
            };
            const value = {a: 'x', extra: 1};
            const error: JSLErrors.AdditionalProperties = {
                type: 'error',
                code: 'no-additional-properties-error',
                message: 'Additional property `extra` in `#/extra` is not allowed',
                data: {
                    pointer: '#/extra',
                    schema,
                    value,
                    property: 'extra',
                    properties: ['a'],
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: parent instance schema-level error message (pointer field not registered)', () => {
            const message = 'additionalProperties error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                allOf: [
                    {
                        properties: {a: {type: JsonSchemaType.String}},
                        additionalProperties: false,
                    },
                ],
                nodeParameters: {errorMessages: {additionalProperties: message}},
            };
            const value = {a: 'x', extra: 1};
            const error: JSLErrors.AdditionalProperties = {
                type: 'error',
                code: 'no-additional-properties-error',
                message: 'Additional property `extra` in `#/extra` is not allowed',
                data: {
                    pointer: '#/extra',
                    schema: schema.allOf![0],
                    value,
                    property: 'extra',
                    properties: ['a'],
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm<any>({onSubmit: () => {}, initialValues: value});

            form.registerField('', () => {}, {}, {data: {schemaPath: '#'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: parent global error message (pointer field not registered)', () => {
            const message = 'additionalProperties error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                properties: {a: {type: JsonSchemaType.String}},
                additionalProperties: false,
            };
            const value = {a: 'x', extra: 1};
            const error: JSLErrors.AdditionalProperties = {
                type: 'error',
                code: 'no-additional-properties-error',
                message: 'Additional property `extra` in `#/extra` is not allowed',
                data: {
                    pointer: '#/extra',
                    schema,
                    value,
                    property: 'extra',
                    properties: ['a'],
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {errorMessages: {additionalProperties: message}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });
    });

    describe('additionalProperties (schema)', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                properties: {a: {type: JsonSchemaType.String}},
                additionalProperties: {type: JsonSchemaType.Number},
            };
            const value = {a: 'x', extra: 1};
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                properties: {a: {type: JsonSchemaType.String}},
                additionalProperties: {type: JsonSchemaType.Number},
            };
            const value = {a: 'x', extra: 'y'};
            const error: JSLErrors.Type = {
                type: 'error',
                code: 'type-error',
                message: 'Expected `y` (string) in `#/extra` to be of type `number`',
                data: {
                    value: 'y',
                    received: 'string',
                    expected: 'number',
                    schema: schema.additionalProperties as JsonSchema,
                    pointer: '#/extra',
                },
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        // error has no specific code for parser tests
    });

    describe('dependencies (list)', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                properties: {a: {type: JsonSchemaType.String}, b: {type: JsonSchemaType.String}},
                dependencies: {a: ['b']},
            };
            const value = {a: 'x', b: 'y'};
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                properties: {a: {type: JsonSchemaType.String}, b: {type: JsonSchemaType.String}},
                dependencies: {a: ['b']},
            };
            const value = {a: 'x'};
            const error: JSLErrors.Dependencies = {
                type: 'error',
                code: 'missing-dependency-error',
                message: "The required propery 'b' in `#` is missing",
                data: {missingProperty: 'b', pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        test('get-parser: default error message (property pointer field registered)', () => {
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                properties: {a: {type: JsonSchemaType.String}, b: {type: JsonSchemaType.String}},
                dependencies: {a: ['b']},
            };
            const value = {a: 'x'};
            const error: JSLErrors.Dependencies = {
                type: 'error',
                code: 'missing-dependency-error',
                message: "The required propery 'b' in `#` is missing",
                data: {missingProperty: 'b', pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('b', () => {}, {}, {});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('b', error.message);
        });

        test('get-parser: error schema-level error message (property pointer field registered)', () => {
            const message = 'dependencies error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                properties: {
                    a: {type: JsonSchemaType.String},
                    b: {
                        type: JsonSchemaType.String,
                        nodeParameters: {
                            errorMessages: {dependencies: 'another error message'},
                        },
                    },
                },
                dependencies: {a: ['b']},
                nodeParameters: {errorMessages: {dependencies: message}},
            };
            const value = {a: 'x'};
            const error: JSLErrors.Dependencies = {
                type: 'error',
                code: 'missing-dependency-error',
                message: "The required propery 'b' in `#` is missing",
                data: {missingProperty: 'b', pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('b', () => {}, {}, {});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {dependencies: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('b', message);
        });

        test('get-parser: instance schema-level error message (property pointer field registered)', () => {
            const message = 'dependencies error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                properties: {b: {nodeParameters: {errorMessages: {dependencies: message}}}},
                allOf: [
                    {
                        properties: {
                            a: {type: JsonSchemaType.String},
                            b: {type: JsonSchemaType.String},
                        },
                        dependencies: {a: ['b']},
                    },
                ],
            };
            const value = {a: 'x'};
            const error: JSLErrors.Dependencies = {
                type: 'error',
                code: 'missing-dependency-error',
                message: "The required propery 'b' in `#` is missing",
                data: {missingProperty: 'b', pointer: '#', schema: schema.allOf![0], value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm<any>({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('b', () => {}, {}, {data: {schemaPath: '#/properties/b'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {dependencies: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('b', message);
        });

        test('get-parser: parent instance schema-level error message (property pointer field registered)', () => {
            const message = 'dependencies error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                allOf: [
                    {
                        properties: {
                            a: {type: JsonSchemaType.String},
                            b: {type: JsonSchemaType.String},
                        },
                        dependencies: {a: ['b']},
                    },
                ],
                nodeParameters: {errorMessages: {dependencies: message}},
            };
            const value = {a: 'x'};
            const error: JSLErrors.Dependencies = {
                type: 'error',
                code: 'missing-dependency-error',
                message: "The required propery 'b' in `#` is missing",
                data: {missingProperty: 'b', pointer: '#', schema: schema.allOf![0], value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm<any>({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('', () => {}, {}, {data: {schemaPath: '#'}});
            form.registerField<any>('b', () => {}, {}, {data: {schemaPath: '#/properties/b'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {dependencies: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('b', message);
        });

        test('get-parser: global error message (property pointer field registered)', () => {
            const message = 'dependencies error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                properties: {a: {type: JsonSchemaType.String}, b: {type: JsonSchemaType.String}},
                dependencies: {a: ['b']},
            };
            const value = {a: 'x'};
            const error: JSLErrors.Dependencies = {
                type: 'error',
                code: 'missing-dependency-error',
                message: "The required propery 'b' in `#` is missing",
                data: {missingProperty: 'b', pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm<any>({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('b', () => {}, {}, {data: {schemaPath: '#/properties/b'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {dependencies: message}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('b', message);
        });

        test('get-parser: default error message (property pointer field not registered)', () => {
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                properties: {a: {type: JsonSchemaType.String}, b: {type: JsonSchemaType.String}},
                dependencies: {a: ['b']},
            };
            const value = {a: 'x'};
            const error: JSLErrors.Dependencies = {
                type: 'error',
                code: 'missing-dependency-error',
                message: "The required propery 'b' in `#` is missing",
                data: {missingProperty: 'b', pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', error.message);
        });

        test('get-parser: error schema-level error message (property pointer field not registered)', () => {
            const message = 'dependencies error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                properties: {a: {type: JsonSchemaType.String}, b: {type: JsonSchemaType.String}},
                dependencies: {a: ['b']},
                nodeParameters: {errorMessages: {dependencies: message}},
            };
            const value = {a: 'x'};
            const error: JSLErrors.Dependencies = {
                type: 'error',
                code: 'missing-dependency-error',
                message: "The required propery 'b' in `#` is missing",
                data: {missingProperty: 'b', pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: instance schema-level error message (property pointer field not registered)', () => {
            const message = 'dependencies error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                allOf: [
                    {
                        properties: {
                            a: {type: JsonSchemaType.String},
                            b: {type: JsonSchemaType.String},
                        },
                        dependencies: {a: ['b']},
                    },
                ],
                nodeParameters: {errorMessages: {dependencies: message}},
            };
            const value = {a: 'x'};
            const error: JSLErrors.Dependencies = {
                type: 'error',
                code: 'missing-dependency-error',
                message: "The required propery 'b' in `#` is missing",
                data: {missingProperty: 'b', pointer: '#', schema: schema.allOf![0], value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm<any>({onSubmit: () => {}, initialValues: value});

            form.registerField('', () => {}, {}, {data: {schemaPath: '#'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: global error message (property pointer field not registered)', () => {
            const message = 'dependencies error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                properties: {a: {type: JsonSchemaType.String}, b: {type: JsonSchemaType.String}},
                dependencies: {a: ['b']},
            };
            const value = {a: 'x'};
            const error: JSLErrors.Dependencies = {
                type: 'error',
                code: 'missing-dependency-error',
                message: "The required propery 'b' in `#` is missing",
                data: {missingProperty: 'b', pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {errorMessages: {dependencies: message}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });
    });

    describe('dependencies (schema)', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                properties: {a: {type: JsonSchemaType.String}, b: {type: JsonSchemaType.String}},
                dependencies: {a: {properties: {b: {type: JsonSchemaType.String, minLength: 2}}}},
            };
            const value = {a: 'x', b: 'yz'};
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                properties: {a: {type: JsonSchemaType.String}, b: {type: JsonSchemaType.String}},
                dependencies: {a: {properties: {b: {type: JsonSchemaType.String, minLength: 2}}}},
            };
            const value = {a: 'x', b: 'y'};
            const error: JSLErrors.MinLength = {
                type: 'error',
                code: 'min-length-error',
                message: 'Value `#/b` should have a minimum length of `2`, but got `1`.',
                data: {
                    minLength: 2,
                    length: 1,
                    pointer: '#/b',
                    schema: (schema.dependencies!.a as JsonSchemaObject).properties!.b,
                    value: 'y',
                },
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        // error has no specific code for parser tests
    });

    describe('maxProperties', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                maxProperties: 1,
            };
            const value = {a: 1};
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                maxProperties: 1,
            };
            const value = {a: 1, b: 2};
            const error: JSLErrors.MaxProperties = {
                type: 'error',
                code: 'max-properties-error',
                message: 'Too many properties in `#`, should be `1` at most, but got `2`',
                data: {maxProperties: 1, length: 2, pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        test('get-parser: default error message', () => {
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                maxProperties: 1,
            };
            const value = {a: 1, b: 2};
            const error: JSLErrors.MaxProperties = {
                type: 'error',
                code: 'max-properties-error',
                message: 'Too many properties in `#`, should be `1` at most, but got `2`',
                data: {maxProperties: 1, length: 2, pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', error.message);
        });

        test('get-parser: error schema-level error message', () => {
            const message = 'maxProperties error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                maxProperties: 1,
                nodeParameters: {errorMessages: {maxProperties: message}},
            };
            const value = {a: 1, b: 2};
            const error: JSLErrors.MaxProperties = {
                type: 'error',
                code: 'max-properties-error',
                message: 'Too many properties in `#`, should be `1` at most, but got `2`',
                data: {maxProperties: 1, length: 2, pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {maxProperties: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: instance schema-level error message', () => {
            const message = 'maxProperties error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                allOf: [{maxProperties: 1}],
                nodeParameters: {errorMessages: {maxProperties: message}},
            };
            const value = {a: 1, b: 2};
            const error: JSLErrors.MaxProperties = {
                type: 'error',
                code: 'max-properties-error',
                message: 'Too many properties in `#`, should be `1` at most, but got `2`',
                data: {maxProperties: 1, length: 2, pointer: '#', schema: schema.allOf![0], value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('', () => {}, {}, {data: {schemaPath: '#'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {maxProperties: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: global error message', () => {
            const message = 'maxProperties error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                maxProperties: 1,
            };
            const value = {a: 1, b: 2};
            const error: JSLErrors.MaxProperties = {
                type: 'error',
                code: 'max-properties-error',
                message: 'Too many properties in `#`, should be `1` at most, but got `2`',
                data: {maxProperties: 1, length: 2, pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {maxProperties: message}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });
    });

    describe('minProperties', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                minProperties: 1,
            };
            const value = {a: 1};
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                minProperties: 1,
            };
            const value = {};
            const error: JSLErrors.MinProperties = {
                type: 'error',
                code: 'min-properties-error',
                message: 'Too few properties in `#`, should be at least `1`, but got `0`',
                data: {minProperties: 1, length: 0, pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        test('get-parser: default error message', () => {
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                minProperties: 1,
            };
            const value = {};
            const error: JSLErrors.MinProperties = {
                type: 'error',
                code: 'min-properties-error',
                message: 'Too few properties in `#`, should be at least `1`, but got `0`',
                data: {minProperties: 1, length: 0, pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', error.message);
        });

        test('get-parser: error schema-level error message', () => {
            const message = 'minProperties error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                minProperties: 1,
                nodeParameters: {errorMessages: {minProperties: message}},
            };
            const value = {};
            const error: JSLErrors.MinProperties = {
                type: 'error',
                code: 'min-properties-error',
                message: 'Too few properties in `#`, should be at least `1`, but got `0`',
                data: {minProperties: 1, length: 0, pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {minProperties: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: instance schema-level error message', () => {
            const message = 'minProperties error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                allOf: [{minProperties: 1}],
                nodeParameters: {errorMessages: {minProperties: message}},
            };
            const value = {};
            const error: JSLErrors.MinProperties = {
                type: 'error',
                code: 'min-properties-error',
                message: 'Too few properties in `#`, should be at least `1`, but got `0`',
                data: {minProperties: 1, length: 0, pointer: '#', schema: schema.allOf![0], value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm<any>({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('', () => {}, {}, {data: {schemaPath: '#'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {minProperties: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: global error message', () => {
            const message = 'minProperties error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                minProperties: 1,
            };
            const value = {};
            const error: JSLErrors.MinProperties = {
                type: 'error',
                code: 'min-properties-error',
                message: 'Too few properties in `#`, should be at least `1`, but got `0`',
                data: {minProperties: 1, length: 0, pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {minProperties: message}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });
    });

    describe('properties', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                properties: {a: {type: JsonSchemaType.String}},
            };
            const value = {a: 'x'};
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                properties: {a: {type: JsonSchemaType.String}},
            };
            const value = {a: 1};
            const error: JSLErrors.Type = {
                type: 'error',
                code: 'type-error',
                message: 'Expected `1` (number) in `#/a` to be of type `string`',
                data: {
                    value: 1,
                    received: 'number',
                    expected: 'string',
                    schema: schema.properties!.a,
                    pointer: '#/a',
                },
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        // error has no specific code for parser tests
    });

    describe('propertyNames', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                propertyNames: {pattern: '^[a-z]+$'},
            };
            const value = {a: 1};
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                propertyNames: {pattern: '^[a-z]+$'},
            };
            const value = {A: 1};
            const nestedError: JSLErrors.Pattern = {
                type: 'error',
                code: 'pattern-error',
                message: 'Value in `#/A` should match `^[a-z]+$`, but received `A`',
                data: {
                    pattern: '^[a-z]+$',
                    description: '^[a-z]+$',
                    received: 'A',
                    schema: schema.propertyNames!,
                    value: 'A',
                    pointer: '#/A',
                },
            };
            const error: JSLErrors.PropertyNames = {
                type: 'error',
                code: 'invalid-property-name-error',
                message: 'Invalid property name `A` at `#`',
                data: {
                    property: 'A',
                    pointer: '#',
                    validationError: nestedError,
                    value: 1,
                    schema,
                },
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        test('get-parser: default nested error message (property pointer field registered)', () => {
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                propertyNames: {pattern: '^[a-z]+$'},
            };
            const value = {A: 1};
            const nestedError: JSLErrors.Pattern = {
                type: 'error',
                code: 'pattern-error',
                message: 'Value in `#/A` should match `^[a-z]+$`, but received `A`',
                data: {
                    pattern: '^[a-z]+$',
                    description: '^[a-z]+$',
                    received: 'A',
                    schema: schema.propertyNames!,
                    value: 'A',
                    pointer: '#/A',
                },
            };
            const error: JSLErrors.PropertyNames = {
                type: 'error',
                code: 'invalid-property-name-error',
                message: 'Invalid property name `A` at `#`',
                data: {
                    property: 'A',
                    pointer: '#',
                    validationError: nestedError,
                    value: 1,
                    schema,
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('A', () => {}, {}, {});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('A', nestedError.message);
        });

        test('get-parser: nested error schema-level error message (property pointer field registered)', () => {
            const message = 'propertyNames error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                propertyNames: {
                    pattern: '^[a-z]+$',
                    nodeParameters: {errorMessages: {pattern: message}},
                },
                nodeParameters: {errorMessages: {pattern: 'another error message'}},
            };
            const value = {A: 1};
            const nestedError: JSLErrors.Pattern = {
                type: 'error',
                code: 'pattern-error',
                message: 'Value in `#/A` should match `^[a-z]+$`, but received `A`',
                data: {
                    pattern: '^[a-z]+$',
                    description: '^[a-z]+$',
                    received: 'A',
                    schema: schema.propertyNames!,
                    value: 'A',
                    pointer: '#/A',
                },
            };
            const error: JSLErrors.PropertyNames = {
                type: 'error',
                code: 'invalid-property-name-error',
                message: 'Invalid property name `A` at `#`',
                data: {
                    property: 'A',
                    pointer: '#',
                    validationError: nestedError,
                    value: 1,
                    schema,
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('A', () => {}, {}, {});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {pattern: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('A', message);
        });

        test('get-parser: nested error property instance schema-level error message (property pointer field registered)', () => {
            const message = 'propertyNames error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                properties: {a: {nodeParameters: {errorMessages: {pattern: message}}}},
                allOf: [{propertyNames: {pattern: '^[a-z]+$'}}],
            };
            const value = {A: 1};
            const nestedError: JSLErrors.Pattern = {
                type: 'error',
                code: 'pattern-error',
                message: 'Value in `#/A` should match `^[a-z]+$`, but received `A`',
                data: {
                    pattern: '^[a-z]+$',
                    description: '^[a-z]+$',
                    received: 'A',
                    schema: schema.allOf![0].propertyNames!,
                    value: 'A',
                    pointer: '#/A',
                },
            };
            const error: JSLErrors.PropertyNames = {
                type: 'error',
                code: 'invalid-property-name-error',
                message: 'Invalid property name `A` at `#`',
                data: {
                    property: 'A',
                    pointer: '#',
                    validationError: nestedError,
                    value: 1,
                    schema: schema.allOf![0],
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm<any>({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('A', () => {}, {}, {data: {schemaPath: '#/properties/a'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {pattern: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('A', message);
        });

        test('get-parser: error schema-level error message (property pointer field registered)', () => {
            const message = 'propertyNames error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                allOf: [
                    {
                        propertyNames: {pattern: '^[a-z]+$'},
                        nodeParameters: {errorMessages: {propertyNames: message}},
                    },
                ],
            };
            const value = {A: 1};
            const nestedError: JSLErrors.Pattern = {
                type: 'error',
                code: 'pattern-error',
                message: 'Value in `#/A` should match `^[a-z]+$`, but received `A`',
                data: {
                    pattern: '^[a-z]+$',
                    description: '^[a-z]+$',
                    received: 'A',
                    schema: schema.allOf![0].propertyNames!,
                    value: 'A',
                    pointer: '#/A',
                },
            };
            const error: JSLErrors.PropertyNames = {
                type: 'error',
                code: 'invalid-property-name-error',
                message: 'Invalid property name `A` at `#`',
                data: {
                    property: 'A',
                    pointer: '#',
                    validationError: nestedError,
                    value: 1,
                    schema: schema.allOf![0],
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm<any>({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('A', () => {}, {}, {data: {schemaPath: '#/properties/a'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {pattern: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('A', message);
        });

        test('get-parser: error instance schema-level error message (property pointer field registered)', () => {
            const message = 'propertyNames error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                allOf: [{propertyNames: {pattern: '^[a-z]+$'}}],
                nodeParameters: {errorMessages: {propertyNames: message}},
            };
            const value = {A: 1};
            const nestedError: JSLErrors.Pattern = {
                type: 'error',
                code: 'pattern-error',
                message: 'Value in `#/A` should match `^[a-z]+$`, but received `A`',
                data: {
                    pattern: '^[a-z]+$',
                    description: '^[a-z]+$',
                    received: 'A',
                    schema: schema.allOf![0].propertyNames!,
                    value: 'A',
                    pointer: '#/A',
                },
            };
            const error: JSLErrors.PropertyNames = {
                type: 'error',
                code: 'invalid-property-name-error',
                message: 'Invalid property name `A` at `#`',
                data: {
                    property: 'A',
                    pointer: '#',
                    validationError: nestedError,
                    value: 1,
                    schema: schema.allOf![0],
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm<any>({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('', () => {}, {}, {data: {schemaPath: '#'}});
            form.registerField<any>('A', () => {}, {}, {data: {schemaPath: '#/properties/a'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {pattern: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('A', message);
        });

        test('get-parser: global nested error message (property pointer field registered)', () => {
            const message = 'propertyNames error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                propertyNames: {pattern: '^[a-z]+$'},
            };
            const value = {A: 1};
            const nestedError: JSLErrors.Pattern = {
                type: 'error',
                code: 'pattern-error',
                message: 'Value in `#/A` should match `^[a-z]+$`, but received `A`',
                data: {
                    pattern: '^[a-z]+$',
                    description: '^[a-z]+$',
                    received: 'A',
                    schema: schema.propertyNames!,
                    value: 'A',
                    pointer: '#/A',
                },
            };
            const error: JSLErrors.PropertyNames = {
                type: 'error',
                code: 'invalid-property-name-error',
                message: 'Invalid property name `A` at `#`',
                data: {
                    property: 'A',
                    pointer: '#',
                    validationError: nestedError,
                    value: 1,
                    schema,
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm<any>({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('A', () => {}, {}, {data: {schemaPath: '#/properties/a'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {pattern: message}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('A', message);
        });

        test('get-parser: global error message (property pointer field registered)', () => {
            const message = 'propertyNames error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                propertyNames: {pattern: '^[a-z]+$'},
            };
            const value = {A: 1};
            const nestedError: JSLErrors.Pattern = {
                type: 'error',
                code: 'pattern-error',
                message: 'Value in `#/A` should match `^[a-z]+$`, but received `A`',
                data: {
                    pattern: '^[a-z]+$',
                    description: '^[a-z]+$',
                    received: 'A',
                    schema: schema.propertyNames!,
                    value: 'A',
                    pointer: '#/A',
                },
            };
            const error: JSLErrors.PropertyNames = {
                type: 'error',
                code: 'invalid-property-name-error',
                message: 'Invalid property name `A` at `#`',
                data: {
                    property: 'A',
                    pointer: '#',
                    validationError: nestedError,
                    value: 1,
                    schema,
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm<any>({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('A', () => {}, {}, {data: {schemaPath: '#/properties/a'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {propertyNames: message}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('A', message);
        });

        test('get-parser: default error message (property pointer field not registered)', () => {
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                propertyNames: {pattern: '^[a-z]+$'},
            };
            const value = {A: 1};
            const nestedError: JSLErrors.Pattern = {
                type: 'error',
                code: 'pattern-error',
                message: 'Value in `#/A` should match `^[a-z]+$`, but received `A`',
                data: {
                    pattern: '^[a-z]+$',
                    description: '^[a-z]+$',
                    received: 'A',
                    schema: schema.propertyNames!,
                    value: 'A',
                    pointer: '#/A',
                },
            };
            const error: JSLErrors.PropertyNames = {
                type: 'error',
                code: 'invalid-property-name-error',
                message: 'Invalid property name `A` at `#`',
                data: {
                    property: 'A',
                    pointer: '#',
                    validationError: nestedError,
                    value: 1,
                    schema,
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', error.message);
        });

        test('get-parser: nested error schema-level error message (property pointer field not registered)', () => {
            const message = 'propertyNames error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                propertyNames: {
                    pattern: '^[a-z]+$',
                    nodeParameters: {errorMessages: {propertyNames: message}},
                },
                nodeParameters: {errorMessages: {propertyNames: 'another error message'}},
            };
            const value = {A: 1};
            const nestedError: JSLErrors.Pattern = {
                type: 'error',
                code: 'pattern-error',
                message: 'Value in `#/A` should match `^[a-z]+$`, but received `A`',
                data: {
                    pattern: '^[a-z]+$',
                    description: '^[a-z]+$',
                    received: 'A',
                    schema: schema.propertyNames!,
                    value: 'A',
                    pointer: '#/A',
                },
            };
            const error: JSLErrors.PropertyNames = {
                type: 'error',
                code: 'invalid-property-name-error',
                message: 'Invalid property name `A` at `#`',
                data: {
                    property: 'A',
                    pointer: '#',
                    validationError: nestedError,
                    value: 1,
                    schema,
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {propertyNames: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: error schema-level error message (property pointer field not registered)', () => {
            const message = 'propertyNames error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                propertyNames: {pattern: '^[a-z]+$'},
                nodeParameters: {errorMessages: {propertyNames: message}},
            };
            const value = {A: 1};
            const nestedError: JSLErrors.Pattern = {
                type: 'error',
                code: 'pattern-error',
                message: 'Value in `#/A` should match `^[a-z]+$`, but received `A`',
                data: {
                    pattern: '^[a-z]+$',
                    description: '^[a-z]+$',
                    received: 'A',
                    schema: schema.propertyNames!,
                    value: 'A',
                    pointer: '#/A',
                },
            };
            const error: JSLErrors.PropertyNames = {
                type: 'error',
                code: 'invalid-property-name-error',
                message: 'Invalid property name `A` at `#`',
                data: {
                    property: 'A',
                    pointer: '#',
                    validationError: nestedError,
                    value: 1,
                    schema,
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: instance schema-level error message (property pointer field not registered)', () => {
            const message = 'propertyNames error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                allOf: [{propertyNames: {pattern: '^[a-z]+$'}}],
                nodeParameters: {errorMessages: {propertyNames: message}},
            };
            const value = {A: 1};
            const nestedError: JSLErrors.Pattern = {
                type: 'error',
                code: 'pattern-error',
                message: 'Value in `#/A` should match `^[a-z]+$`, but received `A`',
                data: {
                    pattern: '^[a-z]+$',
                    description: '^[a-z]+$',
                    received: 'A',
                    schema: schema.allOf![0].propertyNames!,
                    value: 'A',
                    pointer: '#/A',
                },
            };
            const error: JSLErrors.PropertyNames = {
                type: 'error',
                code: 'invalid-property-name-error',
                message: 'Invalid property name `A` at `#`',
                data: {
                    property: 'A',
                    pointer: '#',
                    validationError: nestedError,
                    value: 1,
                    schema: schema.allOf![0],
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm<any>({onSubmit: () => {}, initialValues: value});

            form.registerField('', () => {}, {}, {data: {schemaPath: '#'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {propertyNames: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: global error message (property pointer field not registered)', () => {
            const message = 'propertyNames error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                propertyNames: {pattern: '^[a-z]+$'},
            };
            const value = {A: 1};
            const nestedError: JSLErrors.Pattern = {
                type: 'error',
                code: 'pattern-error',
                message: 'Value in `#/A` should match `^[a-z]+$`, but received `A`',
                data: {
                    pattern: '^[a-z]+$',
                    description: '^[a-z]+$',
                    received: 'A',
                    schema: schema.propertyNames!,
                    value: 'A',
                    pointer: '#/A',
                },
            };
            const error: JSLErrors.PropertyNames = {
                type: 'error',
                code: 'invalid-property-name-error',
                message: 'Invalid property name `A` at `#`',
                data: {
                    property: 'A',
                    pointer: '#',
                    validationError: nestedError,
                    value: 1,
                    schema,
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {errorMessages: {propertyNames: message}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });
    });

    describe('required', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                properties: {a: {type: JsonSchemaType.Number}},
                required: ['a'],
            };
            const value = {a: 1};
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                properties: {a: {type: JsonSchemaType.Number}},
                required: ['a'],
            };
            const value = {};
            const error: JSLErrors.Required = {
                type: 'error',
                code: 'required-property-error',
                message: 'The required property `a` is missing at `#`',
                data: {key: 'a', pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        test('get-parser: default error message (property pointer field registered)', () => {
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                properties: {a: {type: JsonSchemaType.Number}},
                required: ['a'],
            };
            const value = {};
            const error: JSLErrors.Required = {
                type: 'error',
                code: 'required-property-error',
                message: 'The required property `a` is missing at `#`',
                data: {key: 'a', pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm<any>({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('a', () => {}, {}, {});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('a', error.message);
        });

        test('get-parser: error schema-level error message (property pointer field registered)', () => {
            const message = 'required error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                properties: {
                    a: {
                        type: JsonSchemaType.Number,
                        nodeParameters: {errorMessages: {required: 'another error message'}},
                    },
                },
                required: ['a'],
                nodeParameters: {errorMessages: {required: message}},
            };
            const value = {};
            const error: JSLErrors.Required = {
                type: 'error',
                code: 'required-property-error',
                message: 'The required property `a` is missing at `#`',
                data: {key: 'a', pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm<any>({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('a', () => {}, {}, {});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {required: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('a', message);
        });

        test('get-parser: property instance schema-level error message (property pointer field registered)', () => {
            const message = 'required error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                properties: {a: {nodeParameters: {errorMessages: {required: message}}}},
                allOf: [{properties: {a: {type: JsonSchemaType.Number}}, required: ['a']}],
            };
            const value = {};
            const error: JSLErrors.Required = {
                type: 'error',
                code: 'required-property-error',
                message: 'The required property `a` is missing at `#`',
                data: {key: 'a', pointer: '#', schema: schema.allOf![0], value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm<any>({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('a', () => {}, {}, {data: {schemaPath: '#/properties/a'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {required: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('a', message);
        });

        test('get-parser: instance schema-level error message (property pointer field registered)', () => {
            const message = 'required error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                allOf: [{properties: {a: {type: JsonSchemaType.Number}}, required: ['a']}],
                nodeParameters: {errorMessages: {required: message}},
            };
            const value = {};
            const error: JSLErrors.Required = {
                type: 'error',
                code: 'required-property-error',
                message: 'The required property `a` is missing at `#`',
                data: {key: 'a', pointer: '#', schema: schema.allOf![0], value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm<any>({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('', () => {}, {}, {data: {schemaPath: '#'}});
            form.registerField<any>('a', () => {}, {}, {data: {schemaPath: '#/properties/a'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {required: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('a', message);
        });

        test('get-parser: global error message (property pointer field registered)', () => {
            const message = 'required error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                properties: {a: {type: JsonSchemaType.Number}},
                required: ['a'],
            };
            const value = {};
            const error: JSLErrors.Required = {
                type: 'error',
                code: 'required-property-error',
                message: 'The required property `a` is missing at `#`',
                data: {key: 'a', pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm<any>({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('a', () => {}, {}, {data: {schemaPath: '#/properties/a'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {required: message}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('a', message);
        });

        test('get-parser: default error message (property pointer field not registered)', () => {
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                properties: {a: {type: JsonSchemaType.Number}},
                required: ['a'],
            };
            const value = {};
            const error: JSLErrors.Required = {
                type: 'error',
                code: 'required-property-error',
                message: 'The required property `a` is missing at `#`',
                data: {key: 'a', pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', error.message);
        });

        test('get-parser: error schema-level error message (property pointer field not registered)', () => {
            const message = 'required error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                properties: {a: {type: JsonSchemaType.Number}},
                required: ['a'],
                nodeParameters: {errorMessages: {required: message}},
            };
            const value = {};
            const error: JSLErrors.Required = {
                type: 'error',
                code: 'required-property-error',
                message: 'The required property `a` is missing at `#`',
                data: {key: 'a', pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: instance schema-level error message (property pointer field not registered)', () => {
            const message = 'required error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                allOf: [{properties: {a: {type: JsonSchemaType.Number}}, required: ['a']}],
                nodeParameters: {errorMessages: {required: message}},
            };
            const value = {};
            const error: JSLErrors.Required = {
                type: 'error',
                code: 'required-property-error',
                message: 'The required property `a` is missing at `#`',
                data: {key: 'a', pointer: '#', schema: schema.allOf![0], value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm<any>({onSubmit: () => {}, initialValues: value});

            form.registerField('', () => {}, {}, {data: {schemaPath: '#'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: global error message (property pointer field not registered)', () => {
            const message = 'required error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                properties: {a: {type: JsonSchemaType.Number}},
                required: ['a'],
            };
            const value = {};
            const error: JSLErrors.Required = {
                type: 'error',
                code: 'required-property-error',
                message: 'The required property `a` is missing at `#`',
                data: {key: 'a', pointer: '#', schema, value},
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {errorMessages: {required: message}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });
    });

    describe('type', () => {
        test('jsl: a valid value produces no errors', () => {
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
            };
            const value = {};
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([]);
        });

        test('jsl: an invalid value produces an error', () => {
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
            };
            const value = 'a';
            const error: JSLErrors.Type = {
                type: 'error',
                code: 'type-error',
                message: 'Expected `a` (string) in `#` to be of type `object`',
                data: {
                    value: 'a',
                    received: 'string',
                    expected: 'object',
                    schema,
                    pointer: '#',
                },
            };
            const node = getSchemaRootNode({schema});

            expect(node.validate(value).errors).toEqual([error]);
        });

        test('get-parser: default error message', () => {
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
            };
            const value = 'a';
            const error: JSLErrors.Type = {
                type: 'error',
                code: 'type-error',
                message: 'Expected `a` (string) in `#` to be of type `object`',
                data: {
                    value: 'a',
                    received: 'string',
                    expected: 'object',
                    schema,
                    pointer: '#',
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', error.message);
        });

        test('get-parser: error schema-level error message', () => {
            const message = 'type error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                nodeParameters: {errorMessages: {type: message}},
            };
            const value = 'a';
            const error: JSLErrors.Type = {
                type: 'error',
                code: 'type-error',
                message: 'Expected `a` (string) in `#` to be of type `object`',
                data: {
                    value: 'a',
                    received: 'string',
                    expected: 'object',
                    schema,
                    pointer: '#',
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {type: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: instance schema-level error message', () => {
            const message = 'type error message';
            const schema: JsonSchemaObject = {
                allOf: [{type: JsonSchemaType.Object}],
                nodeParameters: {errorMessages: {type: message}},
            };
            const value = 'a';
            const error: JSLErrors.Type = {
                type: 'error',
                code: 'type-error',
                message: 'Expected `a` (string) in `#` to be of type `object`',
                data: {
                    value: 'a',
                    received: 'string',
                    expected: 'object',
                    schema: schema.allOf![0],
                    pointer: '#',
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            form.registerField<any>('', () => {}, {}, {data: {schemaPath: '#'}});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {type: 'global error message'}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });

        test('get-parser: global error message', () => {
            const message = 'type error message';
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
            };
            const value = 'a';
            const error: JSLErrors.Type = {
                type: 'error',
                code: 'type-error',
                message: 'Expected `a` (string) in `#` to be of type `object`',
                data: {
                    value: 'a',
                    received: 'string',
                    expected: 'object',
                    schema,
                    pointer: '#',
                },
            };
            const node = getSchemaRootNode({schema});
            const form = createForm({onSubmit: () => {}, initialValues: value});

            const params = {
                error,
                form,
                headName: '',
                setJSLError: jest.fn(),
                state: {schema, errorMessages: {type: message}},
            } as unknown as ParseErrorParams;

            expect(node.validate(value).errors).toEqual([error]);

            getParser(error.code)(params);

            expect(params.setJSLError).toHaveBeenCalledWith('', message);
        });
    });
});
