import {createForm} from 'final-form';
import cloneDeep from 'lodash/cloneDeep';

import {JsonSchemaType, SchemaRendererEventType} from '../../../constants';
import type {JsonSchemaObject, JsonSchemaString} from '../../../types';
import {SCHEMA_RENDERER_SERVICE_FIELD} from '../../../useSchemaRenderer/constants';
import type {SchemaRendererState} from '../../../useSchemaRenderer/types';
import {getServiceFieldName} from '../../../utils';
import {addSchemaPatches, removeSchemaPatches} from '../schema-patch';

describe('addSchemaPatches', () => {
    test('does nothing if schemaPath cannot be resolved from the field name', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const schema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            properties: {a: {type: JsonSchemaType.String}},
        };
        const state = {
            dispatchEvent: jest.fn(),
            originalSchema: cloneDeep(schema),
            patches: [],
            runValidate: jest.fn(),
            schema,
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        addSchemaPatches({
            form,
            patches: [{headName: 'form', name: 'form.a', schema: {minLength: 2}}],
        });

        expect(state.schema).toEqual({
            type: JsonSchemaType.Object,
            properties: {a: {type: JsonSchemaType.String}},
        });
        expect(state.patches).toEqual([]);
        expect(state.dispatchEvent).not.toHaveBeenCalled();
        expect(state.runValidate).not.toHaveBeenCalled();
    });

    test('merges a nested schema and notifies about changed paths', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const schema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            properties: {a: {type: JsonSchemaType.String}},
        };
        const state = {
            dispatchEvent: jest.fn(),
            originalSchema: cloneDeep(schema),
            patches: [],
            runValidate: jest.fn(),
            schema,
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        const patch = {
            headName: 'form',
            schemaPath: '#/properties/a',
            schema: {minLength: 2},
        };

        addSchemaPatches({form, patches: [patch]});

        expect(state.schema).toEqual({
            type: JsonSchemaType.Object,
            properties: {a: {type: JsonSchemaType.String, minLength: 2}},
        });
        expect(state.patches).toEqual([patch]);
        expect(state.dispatchEvent).toHaveBeenCalledWith([
            {type: SchemaRendererEventType.Patch, paths: [['#', 'properties', 'a', 'minLength']]},
        ]);
        expect(state.runValidate).toHaveBeenCalledTimes(1);
    });

    test('records the patch without notifying if values are unchanged', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const schema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            properties: {a: {type: JsonSchemaType.String, minLength: 2}},
        };
        const state = {
            dispatchEvent: jest.fn(),
            originalSchema: cloneDeep(schema),
            patches: [],
            runValidate: jest.fn(),
            schema,
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        const patch = {
            headName: 'form',
            schemaPath: '#/properties/a',
            schema: {minLength: 2},
        };

        addSchemaPatches({form, patches: [patch]});

        expect(state.schema).toBe(schema);
        expect(state.patches).toEqual([patch]);
        expect(state.dispatchEvent).not.toHaveBeenCalled();
        expect(state.runValidate).not.toHaveBeenCalled();
    });

    test('replaces a nested schema when replace is true', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const schema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            properties: {a: {type: JsonSchemaType.String, minLength: 1}},
        };
        const state = {
            dispatchEvent: jest.fn(),
            originalSchema: cloneDeep(schema),
            patches: [],
            runValidate: jest.fn(),
            schema,
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        const patch = {
            headName: 'form',
            schemaPath: '#/properties/a',
            schema: {type: JsonSchemaType.Number},
            replace: true,
        };

        addSchemaPatches({form, patches: [patch]});

        expect(state.schema).toEqual({
            type: JsonSchemaType.Object,
            properties: {a: {type: JsonSchemaType.Number}},
        });
        expect(state.patches).toEqual([patch]);
        expect(state.dispatchEvent).toHaveBeenCalledWith([
            {
                type: SchemaRendererEventType.Patch,
                paths: [
                    ['#', 'properties', 'a', 'type'],
                    ['#', 'properties', 'a', 'type'],
                    ['#', 'properties', 'a', 'minLength'],
                ],
            },
        ]);
        expect(state.runValidate).toHaveBeenCalledTimes(1);
    });

    test('replaces the root schema when replace is true', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const schema: JsonSchemaString = {type: JsonSchemaType.String};
        const state = {
            dispatchEvent: jest.fn(),
            originalSchema: cloneDeep(schema),
            patches: [],
            runValidate: jest.fn(),
            schema,
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        const patch = {
            headName: 'form',
            schemaPath: '#',
            schema: {type: JsonSchemaType.Number},
            replace: true,
        };

        addSchemaPatches({form, patches: [patch]});

        expect(state.schema).toEqual({type: JsonSchemaType.Number});
        expect(state.patches).toEqual([patch]);
        expect(state.dispatchEvent).toHaveBeenCalledWith([
            {
                type: SchemaRendererEventType.Patch,
                paths: [
                    ['#', 'type'],
                    ['#', 'type'],
                ],
            },
        ]);
        expect(state.runValidate).toHaveBeenCalledTimes(1);
    });

    test('resolves schemaPath from a node field name', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const schema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            properties: {a: {type: JsonSchemaType.String}},
        };
        const state = {
            dispatchEvent: jest.fn(),
            originalSchema: cloneDeep(schema),
            patches: [],
            runValidate: jest.fn(),
            schema,
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );
        form.registerField('form.a', () => {}, {}, {data: {state: {schemaPath: '#/properties/a'}}});

        const patch = {
            headName: 'form',
            name: 'form.a',
            schema: {minLength: 2},
        };

        addSchemaPatches({form, patches: [patch]});

        expect(state.schema).toEqual({
            type: JsonSchemaType.Object,
            properties: {a: {type: JsonSchemaType.String, minLength: 2}},
        });
        expect(state.patches).toEqual([patch]);
        expect(state.dispatchEvent).toHaveBeenCalledWith([
            {
                type: SchemaRendererEventType.Patch,
                paths: [['#', 'properties', 'a', 'minLength']],
            },
        ]);
        expect(state.runValidate).toHaveBeenCalledTimes(1);
    });

    test('collects changes from several patches and notifies once per headName', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const schema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            properties: {
                a: {type: JsonSchemaType.String},
                b: {type: JsonSchemaType.Number},
            },
        };
        const state = {
            dispatchEvent: jest.fn(),
            originalSchema: cloneDeep(schema),
            patches: [],
            runValidate: jest.fn(),
            schema,
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        const patchA = {
            headName: 'form',
            schemaPath: '#/properties/a',
            schema: {minLength: 2},
        };
        const patchB = {
            headName: 'form',
            schemaPath: '#/properties/b',
            schema: {minimum: 1},
        };

        addSchemaPatches({form, patches: [patchA, patchB]});

        expect(state.schema).toEqual({
            type: JsonSchemaType.Object,
            properties: {
                a: {type: JsonSchemaType.String, minLength: 2},
                b: {type: JsonSchemaType.Number, minimum: 1},
            },
        });
        expect(state.patches).toEqual([patchA, patchB]);
        expect(state.dispatchEvent).toHaveBeenCalledTimes(1);
        expect(state.dispatchEvent).toHaveBeenCalledWith([
            {
                type: SchemaRendererEventType.Patch,
                paths: [
                    ['#', 'properties', 'a', 'minLength'],
                    ['#', 'properties', 'b', 'minimum'],
                ],
            },
        ]);
        expect(state.runValidate).toHaveBeenCalledTimes(1);
    });

    test('notifies each headName separately', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const formSchema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            properties: {a: {type: JsonSchemaType.String}},
        };
        const otherSchema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            properties: {b: {type: JsonSchemaType.Number}},
        };
        const formState = {
            dispatchEvent: jest.fn(),
            originalSchema: cloneDeep(formSchema),
            patches: [],
            runValidate: jest.fn(),
            schema: formSchema,
        } as unknown as SchemaRendererState;
        const otherState = {
            dispatchEvent: jest.fn(),
            originalSchema: cloneDeep(otherSchema),
            patches: [],
            runValidate: jest.fn(),
            schema: otherSchema,
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state: formState}},
        );
        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'other'),
            () => {},
            {},
            {data: {state: otherState}},
        );

        const patchForm = {
            headName: 'form',
            schemaPath: '#/properties/a',
            schema: {minLength: 2},
        };
        const patchOther = {
            headName: 'other',
            schemaPath: '#/properties/b',
            schema: {minimum: 1},
        };

        addSchemaPatches({form, patches: [patchForm, patchOther]});

        expect(formState.schema).toEqual({
            type: JsonSchemaType.Object,
            properties: {a: {type: JsonSchemaType.String, minLength: 2}},
        });
        expect(otherState.schema).toEqual({
            type: JsonSchemaType.Object,
            properties: {b: {type: JsonSchemaType.Number, minimum: 1}},
        });
        expect(formState.patches).toEqual([patchForm]);
        expect(otherState.patches).toEqual([patchOther]);
        expect(formState.dispatchEvent).toHaveBeenCalledTimes(1);
        expect(formState.dispatchEvent).toHaveBeenCalledWith([
            {
                type: SchemaRendererEventType.Patch,
                paths: [['#', 'properties', 'a', 'minLength']],
            },
        ]);
        expect(otherState.dispatchEvent).toHaveBeenCalledTimes(1);
        expect(otherState.dispatchEvent).toHaveBeenCalledWith([
            {
                type: SchemaRendererEventType.Patch,
                paths: [['#', 'properties', 'b', 'minimum']],
            },
        ]);
        expect(formState.runValidate).toHaveBeenCalledTimes(1);
        expect(otherState.runValidate).toHaveBeenCalledTimes(1);
    });
});

describe('removeSchemaPatches', () => {
    test('does nothing if schemaPath cannot be resolved from the field name', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const patch = {
            headName: 'form',
            schemaPath: '#/properties/a',
            schema: {minLength: 2},
        };
        const schema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            properties: {a: {type: JsonSchemaType.String, minLength: 2}},
        };
        const state = {
            dispatchEvent: jest.fn(),
            originalSchema: {
                type: JsonSchemaType.Object,
                properties: {a: {type: JsonSchemaType.String}},
            },
            patches: [patch],
            runValidate: jest.fn(),
            schema,
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        removeSchemaPatches({
            form,
            patchesToRemove: [{headName: 'form', name: 'form.a', schema: {minLength: 2}}],
        });

        expect(state.schema).toEqual({
            type: JsonSchemaType.Object,
            properties: {a: {type: JsonSchemaType.String, minLength: 2}},
        });
        expect(state.patches).toEqual([patch]);
        expect(state.dispatchEvent).not.toHaveBeenCalled();
        expect(state.runValidate).not.toHaveBeenCalled();
    });

    test('removes a matching patch and restores the original leaf value', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const patch = {
            headName: 'form',
            schemaPath: '#/properties/a',
            schema: {type: JsonSchemaType.Number},
        };
        const schema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            properties: {a: {type: JsonSchemaType.Number}},
        };
        const state = {
            dispatchEvent: jest.fn(),
            originalSchema: {
                type: JsonSchemaType.Object,
                properties: {a: {type: JsonSchemaType.String}},
            },
            patches: [patch],
            runValidate: jest.fn(),
            schema,
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        removeSchemaPatches({
            form,
            patchesToRemove: [
                {
                    headName: 'form',
                    schemaPath: '#/properties/a',
                    schema: {type: JsonSchemaType.Number},
                },
            ],
        });

        expect(state.schema).toEqual({
            type: JsonSchemaType.Object,
            properties: {a: {type: JsonSchemaType.String}},
        });
        expect(state.patches).toEqual([]);
        expect(state.dispatchEvent).toHaveBeenCalledWith([
            {
                type: SchemaRendererEventType.Patch,
                paths: [['#', 'properties', 'a', 'type']],
            },
        ]);
        expect(state.runValidate).toHaveBeenCalledTimes(1);
    });

    test('does not remove a patch when the schema does not match', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const patch = {
            headName: 'form',
            schemaPath: '#/properties/a',
            schema: {minLength: 2},
        };
        const schema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            properties: {a: {type: JsonSchemaType.String, minLength: 2}},
        };
        const state = {
            dispatchEvent: jest.fn(),
            originalSchema: {
                type: JsonSchemaType.Object,
                properties: {a: {type: JsonSchemaType.String}},
            },
            patches: [patch],
            runValidate: jest.fn(),
            schema,
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        removeSchemaPatches({
            form,
            patchesToRemove: [
                {
                    headName: 'form',
                    schemaPath: '#/properties/a',
                    schema: {minLength: 3},
                },
            ],
        });

        expect(state.patches).toEqual([patch]);
        expect(state.dispatchEvent).not.toHaveBeenCalled();
        expect(state.runValidate).not.toHaveBeenCalled();
    });

    test('removes every patch at a schemaPath when schema is true', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const patchMin = {
            headName: 'form',
            schemaPath: '#/properties/a',
            schema: {minLength: 2},
        };
        const patchMax = {
            headName: 'form',
            schemaPath: '#/properties/a',
            schema: {maxLength: 10},
        };
        const schema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            properties: {a: {type: JsonSchemaType.String, minLength: 2, maxLength: 10}},
        };
        const state = {
            dispatchEvent: jest.fn(),
            originalSchema: {
                type: JsonSchemaType.Object,
                properties: {a: {type: JsonSchemaType.String}},
            },
            patches: [patchMin, patchMax],
            runValidate: jest.fn(),
            schema,
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        removeSchemaPatches({
            form,
            patchesToRemove: [{headName: 'form', schemaPath: '#/properties/a', schema: true}],
        });

        expect(state.patches).toEqual([]);
        expect(state.dispatchEvent).not.toHaveBeenCalled();
        expect(state.runValidate).not.toHaveBeenCalled();
    });

    test('keeps patches that do not match and re-applies them', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const patchA = {
            headName: 'form',
            schemaPath: '#/properties/a',
            schema: {type: JsonSchemaType.Number},
        };
        const patchB = {
            headName: 'form',
            schemaPath: '#/properties/b',
            schema: {minimum: 1},
        };
        const schema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            properties: {
                a: {type: JsonSchemaType.Number},
                b: {type: JsonSchemaType.Number, minimum: 1},
            },
        };
        const state = {
            dispatchEvent: jest.fn(),
            originalSchema: {
                type: JsonSchemaType.Object,
                properties: {
                    a: {type: JsonSchemaType.String},
                    b: {type: JsonSchemaType.Number},
                },
            },
            patches: [patchA, patchB],
            runValidate: jest.fn(),
            schema,
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );

        removeSchemaPatches({
            form,
            patchesToRemove: [
                {
                    headName: 'form',
                    schemaPath: '#/properties/a',
                    schema: {type: JsonSchemaType.Number},
                },
            ],
        });

        expect(state.schema).toEqual({
            type: JsonSchemaType.Object,
            properties: {
                a: {type: JsonSchemaType.String},
                b: {type: JsonSchemaType.Number, minimum: 1},
            },
        });
        expect(state.patches).toEqual([patchB]);
        expect(state.dispatchEvent).toHaveBeenCalledWith([
            {
                type: SchemaRendererEventType.Patch,
                paths: [['#', 'properties', 'a', 'type']],
            },
        ]);
        expect(state.runValidate).toHaveBeenCalledTimes(1);
    });

    test('resolves schemaPath from a node field name', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const patch = {
            headName: 'form',
            name: 'form.a',
            schema: {type: JsonSchemaType.Number},
        };
        const schema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            properties: {a: {type: JsonSchemaType.Number}},
        };
        const state = {
            dispatchEvent: jest.fn(),
            originalSchema: {
                type: JsonSchemaType.Object,
                properties: {a: {type: JsonSchemaType.String}},
            },
            patches: [patch],
            runValidate: jest.fn(),
            schema,
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state}},
        );
        form.registerField('form.a', () => {}, {}, {data: {state: {schemaPath: '#/properties/a'}}});

        removeSchemaPatches({
            form,
            patchesToRemove: [
                {headName: 'form', name: 'form.a', schema: {type: JsonSchemaType.Number}},
            ],
        });

        expect(state.schema).toEqual({
            type: JsonSchemaType.Object,
            properties: {a: {type: JsonSchemaType.String}},
        });
        expect(state.patches).toEqual([]);
        expect(state.dispatchEvent).toHaveBeenCalledWith([
            {
                type: SchemaRendererEventType.Patch,
                paths: [['#', 'properties', 'a', 'type']],
            },
        ]);
        expect(state.runValidate).toHaveBeenCalledTimes(1);
    });

    test('removes patches for each headName separately', () => {
        const form = createForm<any>({onSubmit: () => {}});
        const patchForm = {
            headName: 'form',
            schemaPath: '#/properties/a',
            schema: {type: JsonSchemaType.Number},
        };
        const patchOther = {
            headName: 'other',
            schemaPath: '#/properties/b',
            schema: {type: JsonSchemaType.String},
        };
        const formSchema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            properties: {a: {type: JsonSchemaType.Number}},
        };
        const otherSchema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            properties: {b: {type: JsonSchemaType.String}},
        };
        const formState = {
            dispatchEvent: jest.fn(),
            originalSchema: {
                type: JsonSchemaType.Object,
                properties: {a: {type: JsonSchemaType.String}},
            },
            patches: [patchForm],
            runValidate: jest.fn(),
            schema: formSchema,
        } as unknown as SchemaRendererState;
        const otherState = {
            dispatchEvent: jest.fn(),
            originalSchema: {
                type: JsonSchemaType.Object,
                properties: {b: {type: JsonSchemaType.Number}},
            },
            patches: [patchOther],
            runValidate: jest.fn(),
            schema: otherSchema,
        } as unknown as SchemaRendererState;

        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
            () => {},
            {},
            {data: {state: formState}},
        );
        form.registerField(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'other'),
            () => {},
            {},
            {data: {state: otherState}},
        );

        removeSchemaPatches({
            form,
            patchesToRemove: [
                {
                    headName: 'form',
                    schemaPath: '#/properties/a',
                    schema: {type: JsonSchemaType.Number},
                },
                {
                    headName: 'other',
                    schemaPath: '#/properties/b',
                    schema: {type: JsonSchemaType.String},
                },
            ],
        });

        expect(formState.schema).toEqual({
            type: JsonSchemaType.Object,
            properties: {a: {type: JsonSchemaType.String}},
        });
        expect(otherState.schema).toEqual({
            type: JsonSchemaType.Object,
            properties: {b: {type: JsonSchemaType.Number}},
        });
        expect(formState.patches).toEqual([]);
        expect(otherState.patches).toEqual([]);
        expect(formState.dispatchEvent).toHaveBeenCalledTimes(1);
        expect(formState.dispatchEvent).toHaveBeenCalledWith([
            {
                type: SchemaRendererEventType.Patch,
                paths: [['#', 'properties', 'a', 'type']],
            },
        ]);
        expect(otherState.dispatchEvent).toHaveBeenCalledTimes(1);
        expect(otherState.dispatchEvent).toHaveBeenCalledWith([
            {
                type: SchemaRendererEventType.Patch,
                paths: [['#', 'properties', 'b', 'type']],
            },
        ]);
        expect(formState.runValidate).toHaveBeenCalledTimes(1);
        expect(otherState.runValidate).toHaveBeenCalledTimes(1);
    });
});
