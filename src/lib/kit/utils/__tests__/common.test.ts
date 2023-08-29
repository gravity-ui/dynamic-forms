import _ from 'lodash';

import {Spec, SpecTypes, StringSpec} from '../../../core';
import {isCorrectSizeParams, isNotEmptyValue, prepareSpec} from '../common';

describe('kit/utils/common', () => {
    test('isNotEmptyValue', () => {
        let spec: Spec = {
            type: SpecTypes.String,
            viewSpec: {type: ''},
        };

        expect(isNotEmptyValue(undefined, spec)).toBe(false);
        expect(isNotEmptyValue(null, spec)).toBe(false);
        expect(isNotEmptyValue('', spec)).toBe(false);
        expect(isNotEmptyValue('test', spec)).toBe(true);

        spec.viewSpec.hideValues = ['test'];

        expect(isNotEmptyValue('test', spec)).toBe(false);

        spec = {
            type: SpecTypes.Object,
            properties: {
                value: {
                    type: SpecTypes.Object,
                    properties: {
                        value: {
                            type: SpecTypes.String,
                            viewSpec: {type: ''},
                        },
                    },
                    viewSpec: {type: ''},
                },
            },
            viewSpec: {type: ''},
        };

        expect(isNotEmptyValue({}, spec)).toBe(false);
        expect(isNotEmptyValue({value: {value: 'value'}}, spec)).toBe(true);
        expect(isNotEmptyValue({value: {value: null}}, spec)).toBe(false);
        expect(isNotEmptyValue({value: {}}, spec)).toBe(false);

        spec.viewSpec.type = 'oneof';

        expect(isNotEmptyValue({value: {}}, spec)).toBe(true);

        spec = {
            type: SpecTypes.Array,
            items: {
                type: SpecTypes.String,
                viewSpec: {type: ''},
            },
            viewSpec: {type: ''},
        };

        expect(isNotEmptyValue([], spec)).toBe(false);
        expect(isNotEmptyValue([null], spec)).toBe(false);
        expect(isNotEmptyValue([], spec)).toBe(false);
        expect(isNotEmptyValue(['test'], spec)).toBe(true);
    });

    test('prepareSpec', () => {
        expect(prepareSpec(null as any)).toBe(null);
        expect(prepareSpec('foobar' as any)).toBe('foobar');

        expect(prepareSpec({type: 'NUMBER'} as any)).toMatchObject({type: 'number'});

        expect(prepareSpec({defaultValue: '{"value":"value"}'} as any)).toMatchObject({
            defaultValue: undefined,
        });
        expect(
            prepareSpec({type: 'OBJECT', defaultValue: '{"value":"value"}'} as any),
        ).toMatchObject({
            defaultValue: undefined,
            type: 'object',
        });
        expect(
            prepareSpec({type: 'OBJECT', defaultValue: '{"value":"value"}'} as any, true),
        ).toMatchObject({
            defaultValue: {value: 'value'},
            type: 'object',
        });

        expect(prepareSpec({viewSpec: {type: 'BASE'}} as any)).toMatchObject({
            viewSpec: {type: 'base'},
        });

        expect(prepareSpec({viewSpec: {layout: 'ROW'}} as any)).toMatchObject({
            viewSpec: {layout: 'row'},
        });

        expect(prepareSpec({viewSpec: {oneOfParams: {toggler: 'SELECT'}}} as any)).toMatchObject({
            viewSpec: {oneOfParams: {toggler: 'select'}},
        });

        expect(
            prepareSpec({viewSpec: {textContentParams: {themeLabel: 'WARNING'}}} as any),
        ).toMatchObject({
            viewSpec: {textContentParams: {themeLabel: 'warning'}},
        });

        expect(prepareSpec({validator: 'CUSTOM'} as any)).toMatchObject({validator: 'custom'});

        expect(prepareSpec({maxLength: '0', minLength: '0'} as any)).toMatchObject({
            maxLength: undefined,
            minLength: undefined,
        });
        expect(prepareSpec({maxLength: 1} as any)).toMatchObject({maxLength: BigInt(1)});
        expect(prepareSpec({minLength: 1} as any)).toMatchObject({minLength: BigInt(1)});

        expect(prepareSpec({items: {type: 'NUMBER'}} as any)).toMatchObject({
            items: {type: 'number'},
        });

        expect(prepareSpec({maximum: 0, minimum: 0} as any)).toMatchObject({
            maximum: undefined,
            minimum: undefined,
        });
        expect(prepareSpec({maximum: '1'} as any)).toMatchObject({maximum: 1});
        expect(prepareSpec({minimum: '1'} as any)).toMatchObject({minimum: 1});

        expect(prepareSpec({format: 'FLOAT'} as any)).toMatchObject({format: 'float'});

        expect(prepareSpec({properties: {prop: {type: 'NUMBER'}}} as any)).toMatchObject({
            properties: {prop: {type: 'number'}},
        });
    });

    test('isCorrectSizeParams', () => {
        const spec: StringSpec = {
            type: SpecTypes.String,
            viewSpec: {type: ''},
        };

        expect(isCorrectSizeParams(spec)).toBe(false);

        spec.viewSpec.sizeParams = {} as any;

        expect(isCorrectSizeParams(spec)).toBe(false);

        spec.viewSpec.sizeParams!.defaultType = 'foo';

        expect(isCorrectSizeParams(spec)).toBe(false);

        spec.viewSpec.sizeParams!.scale = {};

        expect(isCorrectSizeParams(spec)).toBe(false);

        spec.viewSpec.sizeParams!.scale = {
            foo: {factor: '100', title: 'foo'},
            bar: {factor: '1', title: 'bar'},
        };

        expect(isCorrectSizeParams(spec)).toBe(true);
    });
});
