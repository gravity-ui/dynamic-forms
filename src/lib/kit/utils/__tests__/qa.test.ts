import cloneDeep from 'lodash/cloneDeep';

import type {StringSpec} from '../../../core';
import {SpecTypes} from '../../../core';
import {getArrayItemKey, getQaBase} from '../qa';

const makeSpec = (qa?: string): StringSpec => ({
    type: SpecTypes.String,
    viewSpec: qa === undefined ? {type: 'base'} : {type: 'base', qa},
});

describe('kit/utils/qa', () => {
    describe('getQaBase', () => {
        describe('unset qa returns the field name', () => {
            test.each([
                ['field', undefined, 'field'],
                ['field', makeSpec(), 'field'],
                ['field', makeSpec(''), 'field'],
                ['', makeSpec(), ''],
                ['field.<0>', makeSpec(''), 'field.<0>'],
                ['field.<0>', makeSpec(1 as unknown as string), 'field.<0>'],
            ])('(%j, %j) -> %j', (name, spec, expected) => {
                expect(getQaBase(name, spec)).toBe(expected);
            });
        });

        describe('custom qa', () => {
            test.each([
                // non-item name: qa verbatim
                ['field', 'x', 'x'],
                ['field', 'MyQa', 'MyQa'],
                // form-mode array items
                ['field.<0>', 'tag', 'tag-0'],
                ['field.<12>', 'tag', 'tag-12'],
                ['field.<abc>', 'tag', 'tag-abc'],
                // overview-mode array items
                ['field[0]', 'tag', 'tag-0'],
                ['a.b[3]', 'tag', 'tag-3'],
                // descendants of items: qa verbatim, no ancestor keys
                ['field.<0>.name', 'y', 'y'],
                ['field[0].name', 'y', 'y'],
            ])('(%j, qa: %j) -> %j', (name, qa, expected) => {
                expect(getQaBase(name, makeSpec(qa))).toBe(expected);
            });
        });

        test('does not mutate the spec and is stable across calls', () => {
            const spec = makeSpec('tag');
            const clone = cloneDeep(spec);

            const first = getQaBase('field.<0>', spec);
            const second = getQaBase('field.<0>', spec);

            expect(spec).toEqual(clone);
            expect(second).toBe(first);
        });
    });

    describe('getArrayItemKey', () => {
        test.each([
            ['field.<0>', '0'],
            ['field.<12>', '12'],
            ['field[0]', '0'],
            ['a.b[3]', '3'],
            ['field', undefined],
            ['', undefined],
            ['field.<0>.name', undefined],
            ['field[0].name', undefined],
        ])('%j -> %j', (name, expected) => {
            expect(getArrayItemKey(name)).toBe(expected);
        });
    });
});
