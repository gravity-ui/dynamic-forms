import {
    MockIndependentStringFormComponent,
    MockIndependentStringOverviewComponent,
    MockObjectFormComponent,
    MockObjectWrapper,
    MockStringFormComponent,
    MockStringOverviewComponent,
    MockStringWrapper,
    createMockSchema,
    mockSchemaRendererConfig,
} from '../../../__tests__/helpers.test';
import {JsonSchemaType, SchemaRendererMode} from '../../constants';
import type {JsonSchema, JsonSchemaString} from '../../types';
import {getRenderKit} from '../utils';

describe('Entity/utils', () => {
    describe('getRenderKit', () => {
        test('should return render kit with simple string form component', () => {
            const schema = createMockSchema<JsonSchemaString>(
                JsonSchemaType.String,
                'base',
                'default',
                {viewProp: 'viewProp'},
                {wrapperProp: 'wrapperProp'},
            );

            const result = getRenderKit({
                config: mockSchemaRendererConfig,
                mode: SchemaRendererMode.Form,
                schema,
            });

            expect(result).toEqual({
                View: MockStringFormComponent,
                viewProps: {viewProp: 'viewProp'},
                Wrapper: MockStringWrapper,
                wrapperProps: {wrapperProp: 'wrapperProp'},
                independent: undefined,
            });
        });

        test('should return render kit with simple string overview component', () => {
            const schema = createMockSchema<JsonSchemaString>(
                JsonSchemaType.String,
                'base',
                'default',
                {viewProp: 'viewProp'},
                {wrapperProp: 'wrapperProp'},
            );

            const result = getRenderKit({
                config: mockSchemaRendererConfig,
                mode: SchemaRendererMode.Overview,
                schema,
            });

            expect(result).toEqual({
                View: MockStringOverviewComponent,
                viewProps: {viewProp: 'viewProp'},
                Wrapper: MockStringWrapper,
                wrapperProps: {wrapperProp: 'wrapperProp'},
                independent: undefined,
            });
        });

        test('should return render kit with simple object form component', () => {
            const schema = createMockSchema<JsonSchema>(
                JsonSchemaType.Object,
                'base',
                'default',
                {viewProp: 'viewProp'},
                {wrapperProp: 'wrapperProp'},
            );

            const result = getRenderKit({
                config: mockSchemaRendererConfig,
                mode: SchemaRendererMode.Form,
                schema,
            });

            expect(result).toEqual({
                View: MockObjectFormComponent,
                viewProps: {viewProp: 'viewProp'},
                Wrapper: MockObjectWrapper,
                wrapperProps: {wrapperProp: 'wrapperProp'},
                independent: undefined,
            });
        });

        test('should return render kit with independent string form component', () => {
            const schema = createMockSchema<JsonSchemaString>(
                JsonSchemaType.String,
                'custom',
                'default',
                {viewProp: 'viewProp'},
                {wrapperProp: 'wrapperProp'},
            );

            const result = getRenderKit({
                config: mockSchemaRendererConfig,
                mode: SchemaRendererMode.Form,
                schema,
            });

            expect(result).toEqual({
                View: MockIndependentStringFormComponent,
                viewProps: {viewProp: 'viewProp'},
                Wrapper: MockStringWrapper,
                wrapperProps: {wrapperProp: 'wrapperProp'},
                independent: true,
            });
        });

        test('should return render kit with independent string overview component', () => {
            const schema = createMockSchema<JsonSchemaString>(
                JsonSchemaType.String,
                'custom',
                'default',
                {viewProp: 'viewProp'},
                {wrapperProp: 'wrapperProp'},
            );

            const result = getRenderKit({
                config: mockSchemaRendererConfig,
                mode: SchemaRendererMode.Overview,
                schema,
            });

            expect(result).toEqual({
                View: MockIndependentStringOverviewComponent,
                viewProps: {viewProp: 'viewProp'},
                Wrapper: MockStringWrapper,
                wrapperProps: {wrapperProp: 'wrapperProp'},
                independent: true,
            });
        });

        test('should return render kit with undefined components when viewType/wrapperType are missing', () => {
            const schema: JsonSchema = {
                type: JsonSchemaType.String,
                entityParameters: {
                    viewProps: {viewProp: 'viewProp'},
                    wrapperProps: {wrapperProp: 'wrapperProp'},
                },
            };

            const result = getRenderKit({
                config: mockSchemaRendererConfig,
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
            const schema = createMockSchema<JsonSchemaString>(
                JsonSchemaType.String,
                'unknown',
                'unknown',
                {viewProp: 'viewProp'},
                {wrapperProp: 'wrapperProp'},
            );

            const result = getRenderKit({
                config: mockSchemaRendererConfig,
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
            const schema: JsonSchema = {
                type: JsonSchemaType.String,
            };

            const result = getRenderKit({
                config: mockSchemaRendererConfig,
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
            const schema: JsonSchema = {
                type: JsonSchemaType.String,
                entityParameters: null as any,
            };

            const result = getRenderKit({
                config: mockSchemaRendererConfig,
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
            const schema = createMockSchema<JsonSchema>(
                JsonSchemaType.String,
                'base',
                'default',
                {viewProp: 'viewProp'},
                {wrapperProp: 'wrapperProp'},
            );

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
