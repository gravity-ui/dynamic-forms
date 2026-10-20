import * as deprecated from '../deprecated';
import * as stable from '../index';

describe('public entry points', () => {
    test('exposes SchemaRenderer without the deprecated form API at the package root', () => {
        expect(stable.SchemaRenderer).toBeDefined();
        expect(stable.useSchemaRenderer).toBeInstanceOf(Function);
        expect(stable.config).toBeDefined();
        expect(stable).not.toHaveProperty('DynamicField');
        expect(stable).not.toHaveProperty('DynamicView');
        expect(stable).not.toHaveProperty('SpecTypes');
        expect(stable).not.toHaveProperty('specToJsonSchema');
    });

    test('keeps the old form API and the schema migration helper in deprecated', () => {
        expect(deprecated.DynamicField).toBeDefined();
        expect(deprecated.DynamicView).toBeDefined();
        expect(deprecated.dynamicConfig).toBeDefined();
        expect(deprecated.dynamicViewConfig).toBeDefined();
        expect(deprecated.specToJsonSchema({type: deprecated.SpecTypes.String})).toMatchObject({
            type: stable.JsonSchemaType.String,
        });
    });

    test('shares language configuration between both APIs', () => {
        expect(deprecated.configure).toBe(stable.configure);
        expect(deprecated.getConfig).toBe(stable.getConfig);
        expect(deprecated.Lang).toBe(stable.Lang);
    });
});
