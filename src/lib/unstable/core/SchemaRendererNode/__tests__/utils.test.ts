import type {FormApi} from 'final-form';

import {EMPTY_OBJECT, JsonSchemaType, NodeType, SchemaRendererMode} from '../../constants';
import type {JsonSchemaObject, JsonSchemaString, NodesConfig} from '../../types';
import {SCHEMA_RENDERER_SERVICE_FIELD} from '../../useSchemaRenderer';
import {getServiceFieldName} from '../../utils';
import {getAccumulatedSchema, getRenderKit, scheduleFlush} from '../utils';

describe('getRenderKit', () => {
    test('returns empty kits when schema and config are omitted', () => {
        const result = getRenderKit({});

        expect(result).toEqual({
            [SchemaRendererMode.Form]: {
                entityProps: EMPTY_OBJECT,
                layoutProps: EMPTY_OBJECT,
            },
            [SchemaRendererMode.Overview]: {
                entityProps: EMPTY_OBJECT,
                layoutProps: EMPTY_OBJECT,
            },
        });
        expect(result[SchemaRendererMode.Form].entityProps).toBe(EMPTY_OBJECT);
        expect(result[SchemaRendererMode.Form].layoutProps).toBe(EMPTY_OBJECT);
        expect(result[SchemaRendererMode.Overview].entityProps).toBe(EMPTY_OBJECT);
        expect(result[SchemaRendererMode.Overview].layoutProps).toBe(EMPTY_OBJECT);
    });

    test('resolves a named entity from config for form and overview', () => {
        const FormEntity = () => null;
        const OverviewEntity = () => null;
        const schema: JsonSchemaString = {
            type: JsonSchemaType.String,
            nodeParameters: {
                type: NodeType.String,
                entity: 'text',
                entityProps: {size: 'l', extra: true},
            },
        };
        const config: NodesConfig = {
            [NodeType.String]: {
                formEntities: {
                    text: {
                        Component: FormEntity,
                        defaultProps: {size: 's', gap: 1},
                        independent: true,
                    },
                },
                overviewEntities: {
                    text: {
                        Component: OverviewEntity,
                        defaultProps: {size: 'm', gap: 2},
                        independent: false,
                    },
                },
            },
        };

        const result = getRenderKit({config, schema});

        expect(result[SchemaRendererMode.Form].Entity).toBe(FormEntity);
        expect(result[SchemaRendererMode.Form].entityProps).toEqual({
            size: 'l',
            gap: 1,
            extra: true,
        });
        expect(result[SchemaRendererMode.Form].independent).toBe(true);
        expect(result[SchemaRendererMode.Overview].Entity).toBe(OverviewEntity);
        expect(result[SchemaRendererMode.Overview].entityProps).toEqual({
            size: 'l',
            gap: 2,
            extra: true,
        });
        expect(result[SchemaRendererMode.Overview].independent).toBe(false);
    });

    test('uses a component entity for both form and overview', () => {
        const Entity = () => null;
        const schema: JsonSchemaString = {
            type: JsonSchemaType.String,
            nodeParameters: {
                entity: Entity,
                entityProps: {size: 'l'},
            },
        };

        const result = getRenderKit({schema});

        expect(result[SchemaRendererMode.Form].Entity).toBe(Entity);
        expect(result[SchemaRendererMode.Form].entityProps).toEqual({size: 'l'});
        expect(result[SchemaRendererMode.Form].independent).toBeUndefined();
        expect(result[SchemaRendererMode.Overview].Entity).toBe(Entity);
        expect(result[SchemaRendererMode.Overview].entityProps).toEqual({size: 'l'});
        expect(result[SchemaRendererMode.Overview].independent).toBeUndefined();
    });

    test('formEntity overrides entity for the form kit', () => {
        const SharedEntity = () => null;
        const FormEntity = () => null;
        const schema: JsonSchemaString = {
            type: JsonSchemaType.String,
            nodeParameters: {
                type: NodeType.String,
                entity: SharedEntity,
                entityProps: {from: 'entity'},
                formEntity: 'text',
                formEntityProps: {from: 'formEntity'},
            },
        };
        const config: NodesConfig = {
            [NodeType.String]: {
                formEntities: {
                    text: {Component: FormEntity, independent: true},
                },
            },
        };

        const result = getRenderKit({config, schema});

        expect(result[SchemaRendererMode.Form].Entity).toBe(FormEntity);
        expect(result[SchemaRendererMode.Form].entityProps).toEqual({from: 'formEntity'});
        expect(result[SchemaRendererMode.Form].independent).toBe(true);
        expect(result[SchemaRendererMode.Overview].Entity).toBe(SharedEntity);
        expect(result[SchemaRendererMode.Overview].entityProps).toEqual({from: 'entity'});
    });

    test('uses a component formEntity for the form kit', () => {
        const FormEntity = () => null;
        const schema: JsonSchemaString = {
            type: JsonSchemaType.String,
            nodeParameters: {
                formEntity: FormEntity,
                formEntityProps: {size: 's'},
            },
        };

        const result = getRenderKit({schema});

        expect(result[SchemaRendererMode.Form].Entity).toBe(FormEntity);
        expect(result[SchemaRendererMode.Form].entityProps).toEqual({size: 's'});
        expect(result[SchemaRendererMode.Overview].Entity).toBeUndefined();
    });

    test('overviewEntity overrides entity for the overview kit', () => {
        const SharedEntity = () => null;
        const OverviewEntity = () => null;
        const schema: JsonSchemaString = {
            type: JsonSchemaType.String,
            nodeParameters: {
                entity: SharedEntity,
                overviewEntity: OverviewEntity,
                overviewEntityProps: {from: 'overviewEntity'},
            },
        };

        const result = getRenderKit({schema});

        expect(result[SchemaRendererMode.Form].Entity).toBe(SharedEntity);
        expect(result[SchemaRendererMode.Overview].Entity).toBe(OverviewEntity);
        expect(result[SchemaRendererMode.Overview].entityProps).toEqual({from: 'overviewEntity'});
    });

    test('resolves a named layout from config for form and overview', () => {
        const FormLayout = () => null;
        const OverviewLayout = () => null;
        const schema: JsonSchemaString = {
            type: JsonSchemaType.String,
            nodeParameters: {
                type: NodeType.String,
                layout: 'row',
                layoutProps: {gap: 8, extra: true},
            },
        };
        const config: NodesConfig = {
            [NodeType.String]: {
                formLayouts: {
                    row: {Component: FormLayout, defaultProps: {gap: 1, pad: 2}},
                },
                overviewLayouts: {
                    row: {Component: OverviewLayout, defaultProps: {gap: 4, pad: 3}},
                },
            },
        };

        const result = getRenderKit({config, schema});

        expect(result[SchemaRendererMode.Form].Layout).toBe(FormLayout);
        expect(result[SchemaRendererMode.Form].layoutProps).toEqual({
            gap: 8,
            pad: 2,
            extra: true,
        });
        expect(result[SchemaRendererMode.Overview].Layout).toBe(OverviewLayout);
        expect(result[SchemaRendererMode.Overview].layoutProps).toEqual({
            gap: 8,
            pad: 3,
            extra: true,
        });
    });

    test('uses a component layout for both form and overview', () => {
        const Layout = () => null;
        const schema: JsonSchemaString = {
            type: JsonSchemaType.String,
            nodeParameters: {
                layout: Layout,
                layoutProps: {gap: 8},
            },
        };

        const result = getRenderKit({schema});

        expect(result[SchemaRendererMode.Form].Layout).toBe(Layout);
        expect(result[SchemaRendererMode.Form].layoutProps).toEqual({gap: 8});
        expect(result[SchemaRendererMode.Overview].Layout).toBe(Layout);
        expect(result[SchemaRendererMode.Overview].layoutProps).toEqual({gap: 8});
    });

    test('formLayout and overviewLayout override a shared layout', () => {
        const SharedLayout = () => null;
        const FormLayout = () => null;
        const OverviewLayout = () => null;
        const schema: JsonSchemaString = {
            type: JsonSchemaType.String,
            nodeParameters: {
                type: NodeType.String,
                layout: SharedLayout,
                layoutProps: {from: 'layout'},
                formLayout: 'row',
                formLayoutProps: {from: 'formLayout'},
                overviewLayout: OverviewLayout,
                overviewLayoutProps: {from: 'overviewLayout'},
            },
        };
        const config: NodesConfig = {
            [NodeType.String]: {
                formLayouts: {
                    row: {Component: FormLayout},
                },
            },
        };

        const result = getRenderKit({config, schema});

        expect(result[SchemaRendererMode.Form].Layout).toBe(FormLayout);
        expect(result[SchemaRendererMode.Form].layoutProps).toEqual({from: 'formLayout'});
        expect(result[SchemaRendererMode.Overview].Layout).toBe(OverviewLayout);
        expect(result[SchemaRendererMode.Overview].layoutProps).toEqual({from: 'overviewLayout'});
    });
});

describe('getAccumulatedSchema', () => {
    test('returns an empty object when there is no root schema', () => {
        expect(getAccumulatedSchema('#')).toEqual({});
    });

    test('returns the schema at the given path', () => {
        const nameSchema: JsonSchemaString = {
            type: JsonSchemaType.String,
            minLength: 2,
        };
        const schema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            properties: {name: nameSchema},
        };

        expect(getAccumulatedSchema('#', schema)).toEqual(schema);
        expect(getAccumulatedSchema('#/properties/name', schema)).toEqual(nameSchema);
    });

    test('merges override on top of the path schema', () => {
        const schema: JsonSchemaString = {
            type: JsonSchemaType.String,
            minLength: 2,
            title: 'root',
        };
        const override: JsonSchemaString = {
            type: JsonSchemaType.String,
            maxLength: 5,
            title: 'override',
        };

        expect(getAccumulatedSchema('#', schema, override)).toEqual({
            type: JsonSchemaType.String,
            minLength: 2,
            maxLength: 5,
            title: 'override',
        });
    });

    test('resolves $ref and merges the referenced schema', () => {
        const schema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            definitions: {
                name: {type: JsonSchemaType.String, minLength: 2},
            },
            properties: {
                name: {$ref: '#/definitions/name', title: 'Name'},
            },
        };

        expect(getAccumulatedSchema('#/properties/name', schema)).toEqual({
            $ref: '#/definitions/name',
            title: 'Name',
            type: JsonSchemaType.String,
            minLength: 2,
        });
    });

    test('does not recurse into a cyclic $ref', () => {
        const schema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            definitions: {
                a: {$ref: '#/definitions/b', title: 'a'},
                b: {$ref: '#/definitions/a', title: 'b'},
            },
        };

        expect(getAccumulatedSchema('#/definitions/a', schema)).toEqual({
            $ref: '#/definitions/b',
            title: 'a',
        });
    });

    test('applies override before resolving $ref', () => {
        const schema: JsonSchemaObject = {
            type: JsonSchemaType.Object,
            definitions: {
                name: {type: JsonSchemaType.String, minLength: 2, title: 'from-ref'},
            },
            properties: {
                name: {type: JsonSchemaType.String},
            },
        };
        const override: JsonSchemaString = {
            type: JsonSchemaType.String,
            $ref: '#/definitions/name',
            title: 'from-override',
        };

        expect(getAccumulatedSchema('#/properties/name', schema, override)).toEqual({
            type: JsonSchemaType.String,
            $ref: '#/definitions/name',
            minLength: 2,
            title: 'from-ref',
        });
    });
});

describe('scheduleFlush', () => {
    test('does not call form.batch or runValidate synchronously', () => {
        const runValidate = jest.fn();
        const form = {
            batch: jest.fn(),
            getFieldState: jest.fn(() => ({data: {state: {runValidate}}})),
        } as unknown as FormApi;

        scheduleFlush(form, 'form');

        expect(form.batch).not.toHaveBeenCalled();
        expect(form.getFieldState).not.toHaveBeenCalled();
        expect(runValidate).not.toHaveBeenCalled();
    });

    test('calls form.batch and runValidate in a microtask', async () => {
        const runValidate = jest.fn();
        const form = {
            batch: jest.fn(),
            getFieldState: jest.fn(() => ({data: {state: {runValidate}}})),
        } as unknown as FormApi;

        scheduleFlush(form, 'form');
        await new Promise<void>((resolve) => queueMicrotask(resolve));

        expect(form.getFieldState).toHaveBeenCalledTimes(1);
        expect(form.getFieldState).toHaveBeenCalledWith(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
        );
        expect(form.batch).toHaveBeenCalledTimes(1);
        expect(form.batch).toHaveBeenCalledWith(expect.any(Function));
        expect(runValidate).toHaveBeenCalledTimes(1);
    });

    test('does not throw when there is no renderer state', async () => {
        const form = {
            batch: jest.fn(),
            getFieldState: jest.fn(() => undefined),
        } as unknown as FormApi;

        scheduleFlush(form, 'form');
        await new Promise<void>((resolve) => queueMicrotask(resolve));

        expect(form.getFieldState).toHaveBeenCalledWith(
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'form'),
        );
        expect(form.batch).toHaveBeenCalledTimes(1);
    });

    test('coalesces multiple calls for the same form into a single batch', async () => {
        const runValidate = jest.fn();
        const form = {
            batch: jest.fn(),
            getFieldState: jest.fn(() => ({data: {state: {runValidate}}})),
        } as unknown as FormApi;

        scheduleFlush(form, 'form');
        scheduleFlush(form, 'form');
        scheduleFlush(form, 'form');
        await new Promise<void>((resolve) => queueMicrotask(resolve));

        expect(form.batch).toHaveBeenCalledTimes(1);
        expect(runValidate).toHaveBeenCalledTimes(1);
    });

    test('runs validate for every unique headName on the same form', async () => {
        const runValidateA = jest.fn();
        const runValidateB = jest.fn();
        const form = {
            batch: jest.fn(),
            getFieldState: jest.fn((name: string) => {
                if (name === getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'a')) {
                    return {data: {state: {runValidate: runValidateA}}};
                }

                if (name === getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'b')) {
                    return {data: {state: {runValidate: runValidateB}}};
                }

                return undefined;
            }),
        } as unknown as FormApi;

        scheduleFlush(form, 'a');
        scheduleFlush(form, 'b');
        await new Promise<void>((resolve) => queueMicrotask(resolve));

        expect(form.batch).toHaveBeenCalledTimes(1);
        expect(form.getFieldState).toHaveBeenCalledTimes(2);
        expect(form.getFieldState).toHaveBeenNthCalledWith(
            1,
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'a'),
        );
        expect(form.getFieldState).toHaveBeenNthCalledWith(
            2,
            getServiceFieldName(SCHEMA_RENDERER_SERVICE_FIELD, 'b'),
        );
        expect(runValidateA).toHaveBeenCalledTimes(1);
        expect(runValidateB).toHaveBeenCalledTimes(1);
    });

    test('allows another flush after the scheduled one has run', async () => {
        const runValidate = jest.fn();
        const form = {
            batch: jest.fn(),
            getFieldState: jest.fn(() => ({data: {state: {runValidate}}})),
        } as unknown as FormApi;

        scheduleFlush(form, 'form');
        await new Promise<void>((resolve) => queueMicrotask(resolve));

        scheduleFlush(form, 'form');
        await new Promise<void>((resolve) => queueMicrotask(resolve));

        expect(form.batch).toHaveBeenCalledTimes(2);
        expect(runValidate).toHaveBeenCalledTimes(2);
    });

    test('flushes different forms independently', async () => {
        const runValidateA = jest.fn();
        const runValidateB = jest.fn();
        const formA = {
            batch: jest.fn(),
            getFieldState: jest.fn(() => ({data: {state: {runValidate: runValidateA}}})),
        } as unknown as FormApi;
        const formB = {
            batch: jest.fn(),
            getFieldState: jest.fn(() => ({data: {state: {runValidate: runValidateB}}})),
        } as unknown as FormApi;

        scheduleFlush(formA, 'form');
        scheduleFlush(formB, 'form');
        await new Promise<void>((resolve) => queueMicrotask(resolve));

        expect(formA.batch).toHaveBeenCalledTimes(1);
        expect(formB.batch).toHaveBeenCalledTimes(1);
        expect(runValidateA).toHaveBeenCalledTimes(1);
        expect(runValidateB).toHaveBeenCalledTimes(1);
    });
});
