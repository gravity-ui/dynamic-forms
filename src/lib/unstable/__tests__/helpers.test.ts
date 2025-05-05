import {JsonSchemaType, SchemaRendererMode} from '../core/constants';
import type {
    IndependentView,
    JsonSchema,
    JsonSchemaArray,
    JsonSchemaBoolean,
    JsonSchemaNumber,
    JsonSchemaObject,
    JsonSchemaString,
    SchemaRendererConfig,
    SimpleView,
    Wrapper,
} from '../core/types';

export const MockArrayFormComponent: SimpleView<JsonSchemaArray> = () => null;
export const MockBooleanFormComponent: SimpleView<JsonSchemaBoolean> = () => null;
export const MockNumberFormComponent: SimpleView<JsonSchemaNumber> = () => null;
export const MockObjectFormComponent: SimpleView<JsonSchemaObject> = () => null;
export const MockStringFormComponent: SimpleView<JsonSchemaString> = () => null;

export const MockArrayOverviewComponent: SimpleView<JsonSchemaArray> = () => null;
export const MockBooleanOverviewComponent: SimpleView<JsonSchemaBoolean> = () => null;
export const MockNumberOverviewComponent: SimpleView<JsonSchemaNumber> = () => null;
export const MockObjectOverviewComponent: SimpleView<JsonSchemaObject> = () => null;
export const MockStringOverviewComponent: SimpleView<JsonSchemaString> = () => null;

export const MockIndependentArrayFormComponent: IndependentView<JsonSchemaArray> = () => null;
export const MockIndependentBooleanFormComponent: IndependentView<JsonSchemaBoolean> = () => null;
export const MockIndependentNumberFormComponent: IndependentView<JsonSchemaNumber> = () => null;
export const MockIndependentObjectFormComponent: IndependentView<JsonSchemaObject> = () => null;
export const MockIndependentStringFormComponent: IndependentView<JsonSchemaString> = () => null;

export const MockIndependentArrayOverviewComponent: IndependentView<JsonSchemaArray> = () => null;
export const MockIndependentBooleanOverviewComponent: IndependentView<JsonSchemaBoolean> = () =>
    null;
export const MockIndependentNumberOverviewComponent: IndependentView<JsonSchemaNumber> = () => null;
export const MockIndependentObjectOverviewComponent: IndependentView<JsonSchemaObject> = () => null;
export const MockIndependentStringOverviewComponent: IndependentView<JsonSchemaString> = () => null;

export const MockArrayWrapper: Wrapper<JsonSchemaArray> = () => null;
export const MockBooleanWrapper: Wrapper<JsonSchemaBoolean> = () => null;
export const MockNumberWrapper: Wrapper<JsonSchemaNumber> = () => null;
export const MockObjectWrapper: Wrapper<JsonSchemaObject> = () => null;
export const MockStringWrapper: Wrapper<JsonSchemaString> = () => null;

export const mockSchemaRendererConfig: SchemaRendererConfig = {
    [JsonSchemaType.Array]: {
        views: {
            base: {
                [SchemaRendererMode.Form]: {
                    Component: MockArrayFormComponent,
                },
                [SchemaRendererMode.Overview]: {
                    Component: MockArrayOverviewComponent,
                },
            },
            custom: {
                [SchemaRendererMode.Form]: {
                    Component: MockIndependentArrayFormComponent,
                    independent: true,
                },
                [SchemaRendererMode.Overview]: {
                    Component: MockIndependentArrayOverviewComponent,
                    independent: true,
                },
            },
        },
        wrappers: {
            default: MockArrayWrapper,
        },
        validators: {},
    },
    [JsonSchemaType.Boolean]: {
        views: {
            base: {
                [SchemaRendererMode.Form]: {
                    Component: MockBooleanFormComponent,
                },
                [SchemaRendererMode.Overview]: {
                    Component: MockBooleanOverviewComponent,
                },
            },
            custom: {
                [SchemaRendererMode.Form]: {
                    Component: MockIndependentBooleanFormComponent,
                    independent: true,
                },
                [SchemaRendererMode.Overview]: {
                    Component: MockIndependentBooleanOverviewComponent,
                    independent: true,
                },
            },
        },
        wrappers: {
            default: MockBooleanWrapper,
        },
        validators: {},
    },
    [JsonSchemaType.Number]: {
        views: {
            base: {
                [SchemaRendererMode.Form]: {
                    Component: MockNumberFormComponent,
                },
                [SchemaRendererMode.Overview]: {
                    Component: MockNumberOverviewComponent,
                },
            },
            custom: {
                [SchemaRendererMode.Form]: {
                    Component: MockIndependentNumberFormComponent,
                    independent: true,
                },
                [SchemaRendererMode.Overview]: {
                    Component: MockIndependentNumberOverviewComponent,
                    independent: true,
                },
            },
        },
        wrappers: {
            default: MockNumberWrapper,
        },
        validators: {},
    },
    [JsonSchemaType.Object]: {
        views: {
            base: {
                [SchemaRendererMode.Form]: {
                    Component: MockObjectFormComponent,
                },
                [SchemaRendererMode.Overview]: {
                    Component: MockObjectOverviewComponent,
                },
            },
            custom: {
                [SchemaRendererMode.Form]: {
                    Component: MockIndependentObjectFormComponent,
                    independent: true,
                },
                [SchemaRendererMode.Overview]: {
                    Component: MockIndependentObjectOverviewComponent,
                    independent: true,
                },
            },
        },
        wrappers: {
            default: MockObjectWrapper,
        },
        validators: {},
    },
    [JsonSchemaType.String]: {
        views: {
            base: {
                [SchemaRendererMode.Form]: {
                    Component: MockStringFormComponent,
                },
                [SchemaRendererMode.Overview]: {
                    Component: MockStringOverviewComponent,
                },
            },
            custom: {
                [SchemaRendererMode.Form]: {
                    Component: MockIndependentStringFormComponent,
                    independent: true,
                },
                [SchemaRendererMode.Overview]: {
                    Component: MockIndependentStringOverviewComponent,
                    independent: true,
                },
            },
        },
        wrappers: {
            default: MockStringWrapper,
        },
        validators: {},
    },
};

export function createMockSchema<T extends JsonSchema>(
    type: JsonSchemaType,
    viewType = 'base',
    wrapperType = 'default',
    viewProps: Record<string, any> = {},
    wrapperProps: Record<string, any> = {},
): T {
    return {
        type,
        entityParameters: {
            viewType,
            wrapperType,
            viewProps,
            wrapperProps,
        },
    } as T;
}

describe('helpers', () => {
    test('just empty test', () => {
        expect(true).toBe(true);
    });
});
