import {JsonSchemaType, SchemaRendererMode} from '../../constants';
import type {
    IndependentView,
    JsonSchemaArray,
    JsonSchemaBoolean,
    JsonSchemaNumber,
    JsonSchemaObject,
    JsonSchemaString,
    SchemaRendererConfig,
    SimpleView,
    Wrapper,
} from '../../types';
import {getRenderKit} from '../utils';

const SimpleArrayFormComponent: SimpleView<JsonSchemaArray> = () => null;
const SimpleBooleanFormComponent: SimpleView<JsonSchemaBoolean> = () => null;
const SimpleNumberFormComponent: SimpleView<JsonSchemaNumber> = () => null;
const SimpleObjectFormComponent: SimpleView<JsonSchemaObject> = () => null;
const SimpleStringFormComponent: SimpleView<JsonSchemaString> = () => null;

const SimpleArrayOverviewComponent: SimpleView<JsonSchemaArray> = () => null;
const SimpleBooleanOverviewComponent: SimpleView<JsonSchemaBoolean> = () => null;
const SimpleNumberOverviewComponent: SimpleView<JsonSchemaNumber> = () => null;
const SimpleObjectOverviewComponent: SimpleView<JsonSchemaObject> = () => null;
const SimpleStringOverviewComponent: SimpleView<JsonSchemaString> = () => null;

const IndependentArrayFormComponent: IndependentView<JsonSchemaArray> = () => null;
const IndependentBooleanFormComponent: IndependentView<JsonSchemaBoolean> = () => null;
const IndependentNumberFormComponent: IndependentView<JsonSchemaNumber> = () => null;
const IndependentObjectFormComponent: IndependentView<JsonSchemaObject> = () => null;
const IndependentStringFormComponent: IndependentView<JsonSchemaString> = () => null;

const IndependentArrayOverviewComponent: IndependentView<JsonSchemaArray> = () => null;
const IndependentBooleanOverviewComponent: IndependentView<JsonSchemaBoolean> = () => null;
const IndependentNumberOverviewComponent: IndependentView<JsonSchemaNumber> = () => null;
const IndependentObjectOverviewComponent: IndependentView<JsonSchemaObject> = () => null;
const IndependentStringOverviewComponent: IndependentView<JsonSchemaString> = () => null;

const ArrayWrapper: Wrapper<JsonSchemaArray> = () => null;
const BooleanWrapper: Wrapper<JsonSchemaBoolean> = () => null;
const NumberWrapper: Wrapper<JsonSchemaNumber> = () => null;
const ObjectWrapper: Wrapper<JsonSchemaObject> = () => null;
const StringWrapper: Wrapper<JsonSchemaString> = () => null;

const schemaRendererConfig: SchemaRendererConfig = {
    [JsonSchemaType.Array]: {
        views: {
            simple: {
                [SchemaRendererMode.Form]: {
                    Component: SimpleArrayFormComponent,
                },
                [SchemaRendererMode.Overview]: {
                    Component: SimpleArrayOverviewComponent,
                },
            },
            independent: {
                [SchemaRendererMode.Form]: {
                    Component: IndependentArrayFormComponent,
                    independent: true,
                },
                [SchemaRendererMode.Overview]: {
                    Component: IndependentArrayOverviewComponent,
                    independent: true,
                },
            },
        },
        wrappers: {
            base: ArrayWrapper,
        },
        validators: {},
    },
    [JsonSchemaType.Boolean]: {
        views: {
            simple: {
                [SchemaRendererMode.Form]: {
                    Component: SimpleBooleanFormComponent,
                },
                [SchemaRendererMode.Overview]: {
                    Component: SimpleBooleanOverviewComponent,
                },
            },
            independent: {
                [SchemaRendererMode.Form]: {
                    Component: IndependentBooleanFormComponent,
                    independent: true,
                },
                [SchemaRendererMode.Overview]: {
                    Component: IndependentBooleanOverviewComponent,
                    independent: true,
                },
            },
        },
        wrappers: {
            base: BooleanWrapper,
        },
        validators: {},
    },
    [JsonSchemaType.Number]: {
        views: {
            simple: {
                [SchemaRendererMode.Form]: {
                    Component: SimpleNumberFormComponent,
                },
                [SchemaRendererMode.Overview]: {
                    Component: SimpleNumberOverviewComponent,
                },
            },
            independent: {
                [SchemaRendererMode.Form]: {
                    Component: IndependentNumberFormComponent,
                    independent: true,
                },
                [SchemaRendererMode.Overview]: {
                    Component: IndependentNumberOverviewComponent,
                    independent: true,
                },
            },
        },
        wrappers: {
            base: NumberWrapper,
        },
        validators: {},
    },
    [JsonSchemaType.Object]: {
        views: {
            simple: {
                [SchemaRendererMode.Form]: {
                    Component: SimpleObjectFormComponent,
                },
                [SchemaRendererMode.Overview]: {
                    Component: SimpleObjectOverviewComponent,
                },
            },
            independent: {
                [SchemaRendererMode.Form]: {
                    Component: IndependentObjectFormComponent,
                    independent: true,
                },
                [SchemaRendererMode.Overview]: {
                    Component: IndependentObjectOverviewComponent,
                    independent: true,
                },
            },
        },
        wrappers: {
            base: ObjectWrapper,
        },
        validators: {},
    },
    [JsonSchemaType.String]: {
        views: {
            simple: {
                [SchemaRendererMode.Form]: {
                    Component: SimpleStringFormComponent,
                },
                [SchemaRendererMode.Overview]: {
                    Component: SimpleStringOverviewComponent,
                },
            },
            independent: {
                [SchemaRendererMode.Form]: {
                    Component: IndependentStringFormComponent,
                    independent: true,
                },
                [SchemaRendererMode.Overview]: {
                    Component: IndependentStringOverviewComponent,
                    independent: true,
                },
            },
        },
        wrappers: {
            base: StringWrapper,
        },
        validators: {},
    },
};

describe('core/Entity/utils', () => {
    describe('getRenderKit', () => {
        test('should return render kit with simple array form component', () => {
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                entityParameters: {
                    viewType: 'simple',
                    wrapperType: 'base',
                    viewProps: {viewProp: 'viewProp'},
                    wrapperProps: {wrapperProp: 'wrapperProp'},
                },
            };

            const result = getRenderKit({
                config: schemaRendererConfig,
                mode: SchemaRendererMode.Form,
                schema,
            });

            expect(result).toEqual({
                View: SimpleArrayFormComponent,
                viewProps: {viewProp: 'viewProp'},
                Wrapper: ArrayWrapper,
                wrapperProps: {wrapperProp: 'wrapperProp'},
                independent: undefined,
            });
        });

        test('should return render kit with simple array overview component', () => {
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                entityParameters: {
                    viewType: 'simple',
                    wrapperType: 'base',
                    viewProps: {viewProp: 'viewProp'},
                    wrapperProps: {wrapperProp: 'wrapperProp'},
                },
            };

            const result = getRenderKit({
                config: schemaRendererConfig,
                mode: SchemaRendererMode.Overview,
                schema,
            });

            expect(result).toEqual({
                View: SimpleArrayOverviewComponent,
                viewProps: {viewProp: 'viewProp'},
                Wrapper: ArrayWrapper,
                wrapperProps: {wrapperProp: 'wrapperProp'},
                independent: undefined,
            });
        });

        test('should return render kit with independent array form component', () => {
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                entityParameters: {
                    viewType: 'independent',
                    wrapperType: 'base',
                    viewProps: {viewProp: 'viewProp'},
                    wrapperProps: {wrapperProp: 'wrapperProp'},
                },
            };

            const result = getRenderKit({
                config: schemaRendererConfig,
                mode: SchemaRendererMode.Form,
                schema,
            });

            expect(result).toEqual({
                View: IndependentArrayFormComponent,
                viewProps: {viewProp: 'viewProp'},
                Wrapper: ArrayWrapper,
                wrapperProps: {wrapperProp: 'wrapperProp'},
                independent: true,
            });
        });

        test('should return render kit with independent array overview component', () => {
            const schema: JsonSchemaArray = {
                type: JsonSchemaType.Array,
                entityParameters: {
                    viewType: 'independent',
                    wrapperType: 'base',
                    viewProps: {viewProp: 'viewProp'},
                    wrapperProps: {wrapperProp: 'wrapperProp'},
                },
            };

            const result = getRenderKit({
                config: schemaRendererConfig,
                mode: SchemaRendererMode.Overview,
                schema,
            });

            expect(result).toEqual({
                View: IndependentArrayOverviewComponent,
                viewProps: {viewProp: 'viewProp'},
                Wrapper: ArrayWrapper,
                wrapperProps: {wrapperProp: 'wrapperProp'},
                independent: true,
            });
        });

        test('should return render kit with simple boolean form component', () => {
            const schema: JsonSchemaBoolean = {
                type: JsonSchemaType.Boolean,
                entityParameters: {
                    viewType: 'simple',
                    wrapperType: 'base',
                    viewProps: {viewProp: 'viewProp'},
                    wrapperProps: {wrapperProp: 'wrapperProp'},
                },
            };

            const result = getRenderKit({
                config: schemaRendererConfig,
                mode: SchemaRendererMode.Form,
                schema,
            });

            expect(result).toEqual({
                View: SimpleBooleanFormComponent,
                viewProps: {viewProp: 'viewProp'},
                Wrapper: BooleanWrapper,
                wrapperProps: {wrapperProp: 'wrapperProp'},
                independent: undefined,
            });
        });

        test('should return render kit with simple boolean overview component', () => {
            const schema: JsonSchemaBoolean = {
                type: JsonSchemaType.Boolean,
                entityParameters: {
                    viewType: 'simple',
                    wrapperType: 'base',
                    viewProps: {viewProp: 'viewProp'},
                    wrapperProps: {wrapperProp: 'wrapperProp'},
                },
            };

            const result = getRenderKit({
                config: schemaRendererConfig,
                mode: SchemaRendererMode.Overview,
                schema,
            });

            expect(result).toEqual({
                View: SimpleBooleanOverviewComponent,
                viewProps: {viewProp: 'viewProp'},
                Wrapper: BooleanWrapper,
                wrapperProps: {wrapperProp: 'wrapperProp'},
                independent: undefined,
            });
        });

        test('should return render kit with independent boolean form component', () => {
            const schema: JsonSchemaBoolean = {
                type: JsonSchemaType.Boolean,
                entityParameters: {
                    viewType: 'independent',
                    wrapperType: 'base',
                    viewProps: {viewProp: 'viewProp'},
                    wrapperProps: {wrapperProp: 'wrapperProp'},
                },
            };

            const result = getRenderKit({
                config: schemaRendererConfig,
                mode: SchemaRendererMode.Form,
                schema,
            });

            expect(result).toEqual({
                View: IndependentBooleanFormComponent,
                viewProps: {viewProp: 'viewProp'},
                Wrapper: BooleanWrapper,
                wrapperProps: {wrapperProp: 'wrapperProp'},
                independent: true,
            });
        });

        test('should return render kit with independent boolean overview component', () => {
            const schema: JsonSchemaBoolean = {
                type: JsonSchemaType.Boolean,
                entityParameters: {
                    viewType: 'independent',
                    wrapperType: 'base',
                    viewProps: {viewProp: 'viewProp'},
                    wrapperProps: {wrapperProp: 'wrapperProp'},
                },
            };

            const result = getRenderKit({
                config: schemaRendererConfig,
                mode: SchemaRendererMode.Overview,
                schema,
            });

            expect(result).toEqual({
                View: IndependentBooleanOverviewComponent,
                viewProps: {viewProp: 'viewProp'},
                Wrapper: BooleanWrapper,
                wrapperProps: {wrapperProp: 'wrapperProp'},
                independent: true,
            });
        });

        test('should return render kit with simple number form component', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                entityParameters: {
                    viewType: 'simple',
                    wrapperType: 'base',
                    viewProps: {viewProp: 'viewProp'},
                    wrapperProps: {wrapperProp: 'wrapperProp'},
                },
            };

            const result = getRenderKit({
                config: schemaRendererConfig,
                mode: SchemaRendererMode.Form,
                schema,
            });

            expect(result).toEqual({
                View: SimpleNumberFormComponent,
                viewProps: {viewProp: 'viewProp'},
                Wrapper: NumberWrapper,
                wrapperProps: {wrapperProp: 'wrapperProp'},
                independent: undefined,
            });
        });

        test('should return render kit with simple number overview component', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                entityParameters: {
                    viewType: 'simple',
                    wrapperType: 'base',
                    viewProps: {viewProp: 'viewProp'},
                    wrapperProps: {wrapperProp: 'wrapperProp'},
                },
            };

            const result = getRenderKit({
                config: schemaRendererConfig,
                mode: SchemaRendererMode.Overview,
                schema,
            });

            expect(result).toEqual({
                View: SimpleNumberOverviewComponent,
                viewProps: {viewProp: 'viewProp'},
                Wrapper: NumberWrapper,
                wrapperProps: {wrapperProp: 'wrapperProp'},
                independent: undefined,
            });
        });

        test('should return render kit with independent number form component', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                entityParameters: {
                    viewType: 'independent',
                    wrapperType: 'base',
                    viewProps: {viewProp: 'viewProp'},
                    wrapperProps: {wrapperProp: 'wrapperProp'},
                },
            };

            const result = getRenderKit({
                config: schemaRendererConfig,
                mode: SchemaRendererMode.Form,
                schema,
            });

            expect(result).toEqual({
                View: IndependentNumberFormComponent,
                viewProps: {viewProp: 'viewProp'},
                Wrapper: NumberWrapper,
                wrapperProps: {wrapperProp: 'wrapperProp'},
                independent: true,
            });
        });

        test('should return render kit with independent number overview component', () => {
            const schema: JsonSchemaNumber = {
                type: JsonSchemaType.Number,
                entityParameters: {
                    viewType: 'independent',
                    wrapperType: 'base',
                    viewProps: {viewProp: 'viewProp'},
                    wrapperProps: {wrapperProp: 'wrapperProp'},
                },
            };

            const result = getRenderKit({
                config: schemaRendererConfig,
                mode: SchemaRendererMode.Overview,
                schema,
            });

            expect(result).toEqual({
                View: IndependentNumberOverviewComponent,
                viewProps: {viewProp: 'viewProp'},
                Wrapper: NumberWrapper,
                wrapperProps: {wrapperProp: 'wrapperProp'},
                independent: true,
            });
        });

        test('should return render kit with simple object form component', () => {
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                entityParameters: {
                    viewType: 'simple',
                    wrapperType: 'base',
                    viewProps: {viewProp: 'viewProp'},
                    wrapperProps: {wrapperProp: 'wrapperProp'},
                },
            };

            const result = getRenderKit({
                config: schemaRendererConfig,
                mode: SchemaRendererMode.Form,
                schema,
            });

            expect(result).toEqual({
                View: SimpleObjectFormComponent,
                viewProps: {viewProp: 'viewProp'},
                Wrapper: ObjectWrapper,
                wrapperProps: {wrapperProp: 'wrapperProp'},
                independent: undefined,
            });
        });

        test('should return render kit with simple object overview component', () => {
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                entityParameters: {
                    viewType: 'simple',
                    wrapperType: 'base',
                    viewProps: {viewProp: 'viewProp'},
                    wrapperProps: {wrapperProp: 'wrapperProp'},
                },
            };

            const result = getRenderKit({
                config: schemaRendererConfig,
                mode: SchemaRendererMode.Overview,
                schema,
            });

            expect(result).toEqual({
                View: SimpleObjectOverviewComponent,
                viewProps: {viewProp: 'viewProp'},
                Wrapper: ObjectWrapper,
                wrapperProps: {wrapperProp: 'wrapperProp'},
                independent: undefined,
            });
        });

        test('should return render kit with independent object form component', () => {
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                entityParameters: {
                    viewType: 'independent',
                    wrapperType: 'base',
                    viewProps: {viewProp: 'viewProp'},
                    wrapperProps: {wrapperProp: 'wrapperProp'},
                },
            };

            const result = getRenderKit({
                config: schemaRendererConfig,
                mode: SchemaRendererMode.Form,
                schema,
            });

            expect(result).toEqual({
                View: IndependentObjectFormComponent,
                viewProps: {viewProp: 'viewProp'},
                Wrapper: ObjectWrapper,
                wrapperProps: {wrapperProp: 'wrapperProp'},
                independent: true,
            });
        });

        test('should return render kit with independent object overview component', () => {
            const schema: JsonSchemaObject = {
                type: JsonSchemaType.Object,
                entityParameters: {
                    viewType: 'independent',
                    wrapperType: 'base',
                    viewProps: {viewProp: 'viewProp'},
                    wrapperProps: {wrapperProp: 'wrapperProp'},
                },
            };

            const result = getRenderKit({
                config: schemaRendererConfig,
                mode: SchemaRendererMode.Overview,
                schema,
            });

            expect(result).toEqual({
                View: IndependentObjectOverviewComponent,
                viewProps: {viewProp: 'viewProp'},
                Wrapper: ObjectWrapper,
                wrapperProps: {wrapperProp: 'wrapperProp'},
                independent: true,
            });
        });

        test('should return render kit with simple string form component', () => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                entityParameters: {
                    viewType: 'simple',
                    wrapperType: 'base',
                    viewProps: {viewProp: 'viewProp'},
                    wrapperProps: {wrapperProp: 'wrapperProp'},
                },
            };

            const result = getRenderKit({
                config: schemaRendererConfig,
                mode: SchemaRendererMode.Form,
                schema,
            });

            expect(result).toEqual({
                View: SimpleStringFormComponent,
                viewProps: {viewProp: 'viewProp'},
                Wrapper: StringWrapper,
                wrapperProps: {wrapperProp: 'wrapperProp'},
                independent: undefined,
            });
        });

        test('should return render kit with simple string overview component', () => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                entityParameters: {
                    viewType: 'simple',
                    wrapperType: 'base',
                    viewProps: {viewProp: 'viewProp'},
                    wrapperProps: {wrapperProp: 'wrapperProp'},
                },
            };

            const result = getRenderKit({
                config: schemaRendererConfig,
                mode: SchemaRendererMode.Overview,
                schema,
            });

            expect(result).toEqual({
                View: SimpleStringOverviewComponent,
                viewProps: {viewProp: 'viewProp'},
                Wrapper: StringWrapper,
                wrapperProps: {wrapperProp: 'wrapperProp'},
                independent: undefined,
            });
        });

        test('should return render kit with independent string form component', () => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                entityParameters: {
                    viewType: 'independent',
                    wrapperType: 'base',
                    viewProps: {viewProp: 'viewProp'},
                    wrapperProps: {wrapperProp: 'wrapperProp'},
                },
            };

            const result = getRenderKit({
                config: schemaRendererConfig,
                mode: SchemaRendererMode.Form,
                schema,
            });

            expect(result).toEqual({
                View: IndependentStringFormComponent,
                viewProps: {viewProp: 'viewProp'},
                Wrapper: StringWrapper,
                wrapperProps: {wrapperProp: 'wrapperProp'},
                independent: true,
            });
        });

        test('should return render kit with independent string overview component', () => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                entityParameters: {
                    viewType: 'independent',
                    wrapperType: 'base',
                    viewProps: {viewProp: 'viewProp'},
                    wrapperProps: {wrapperProp: 'wrapperProp'},
                },
            };

            const result = getRenderKit({
                config: schemaRendererConfig,
                mode: SchemaRendererMode.Overview,
                schema,
            });

            expect(result).toEqual({
                View: IndependentStringOverviewComponent,
                viewProps: {viewProp: 'viewProp'},
                Wrapper: StringWrapper,
                wrapperProps: {wrapperProp: 'wrapperProp'},
                independent: true,
            });
        });

        test('should return render kit with undefined components when viewType/wrapperType are missing', () => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                entityParameters: {
                    viewProps: {viewProp: 'viewProp'},
                    wrapperProps: {wrapperProp: 'wrapperProp'},
                },
            };

            const result = getRenderKit({
                config: schemaRendererConfig,
                mode: SchemaRendererMode.Form,
                schema,
            });

            expect(result).toEqual({
                View: undefined,
                viewProps: {viewProp: 'viewProp'},
                Wrapper: undefined,
                wrapperProps: {wrapperProp: 'wrapperProp'},
                independent: undefined,
            });
        });

        test('should return render kit with undefined components when viewType/wrapperType are unknown', () => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                entityParameters: {
                    viewType: 'unknown',
                    wrapperType: 'unknown',
                    viewProps: {viewProp: 'viewProp'},
                    wrapperProps: {wrapperProp: 'wrapperProp'},
                },
            };
            const result = getRenderKit({
                config: schemaRendererConfig,
                mode: SchemaRendererMode.Form,
                schema,
            });

            expect(result).toEqual({
                View: undefined,
                viewProps: {viewProp: 'viewProp'},
                Wrapper: undefined,
                wrapperProps: {wrapperProp: 'wrapperProp'},
                independent: undefined,
            });
        });

        test('should return render kit with undefined components when entityParameters is empty', () => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
            };

            const result = getRenderKit({
                config: schemaRendererConfig,
                mode: SchemaRendererMode.Form,
                schema,
            });

            expect(result).toEqual({
                View: undefined,
                viewProps: {},
                Wrapper: undefined,
                wrapperProps: {},
                independent: undefined,
            });
        });

        test('should return render kit with undefined components when entityParameters is null', () => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                entityParameters: null as any,
            };

            const result = getRenderKit({
                config: schemaRendererConfig,
                mode: SchemaRendererMode.Form,
                schema,
            });

            expect(result).toEqual({
                View: undefined,
                viewProps: {},
                Wrapper: undefined,
                wrapperProps: {},
                independent: undefined,
            });
        });

        test('should return render kit with undefined components when config is empty', () => {
            const schema: JsonSchemaString = {
                type: JsonSchemaType.String,
                entityParameters: {
                    viewType: 'simple',
                    wrapperType: 'base',
                    viewProps: {viewProp: 'viewProp'},
                    wrapperProps: {wrapperProp: 'wrapperProp'},
                },
            };
            const emptyConfig = {
                [JsonSchemaType.String]: {
                    views: {},
                    wrappers: {},
                    validators: {},
                },
                [JsonSchemaType.Array]: {
                    views: {},
                    wrappers: {},
                    validators: {},
                },
                [JsonSchemaType.Boolean]: {
                    views: {},
                    wrappers: {},
                    validators: {},
                },
                [JsonSchemaType.Number]: {
                    views: {},
                    wrappers: {},
                    validators: {},
                },
                [JsonSchemaType.Object]: {
                    views: {},
                    wrappers: {},
                    validators: {},
                },
            };

            const result = getRenderKit({
                config: emptyConfig,
                mode: SchemaRendererMode.Form,
                schema,
            });

            expect(result).toEqual({
                View: undefined,
                viewProps: {viewProp: 'viewProp'},
                Wrapper: undefined,
                wrapperProps: {wrapperProp: 'wrapperProp'},
                independent: undefined,
            });
        });
    });
});
