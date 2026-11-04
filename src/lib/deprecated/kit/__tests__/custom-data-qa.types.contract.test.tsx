/**
 * Type-level contract tests for `viewSpec.qa` (gravity-ui/dynamic-forms#462).
 *
 * Checked by `tsc` (`npm run typecheck`), not by Jest: Jest transpiles with SWC. If an
 * `@ts-expect-error` below stops being an error, `tsc` reports an unused directive.
 */
import type {NumberSpec, Spec, StringSpec} from '../../core';
import {SpecTypes} from '../../core';
import type {NumberProps, TextProps} from '../components';

// AC-21: `viewSpec.qa` is an optional string.
const withQa: StringSpec = {type: SpecTypes.String, viewSpec: {type: 'base', qa: 'string-qa'}};
const withoutQa: Spec = {type: SpecTypes.Number, viewSpec: {type: 'base'}};
const nonString: Spec = {
    type: SpecTypes.Object,
    viewSpec: {
        type: 'base',
        // @ts-expect-error AC-21: qa must be a string
        qa: 1,
    },
};

// AC-20: `qa` stays excluded from the published input-props types.
const textInputProps: StringSpec<undefined, TextProps> = {
    type: SpecTypes.String,
    viewSpec: {
        type: 'base',
        inputProps: {
            // @ts-expect-error AC-20: qa is not part of TextProps
            qa: 'x',
        },
    },
};
const numberInputProps: NumberSpec<undefined, NumberProps> = {
    type: SpecTypes.Number,
    viewSpec: {
        type: 'base',
        inputProps: {
            // @ts-expect-error AC-20: qa is not part of NumberProps
            qa: 'x',
        },
    },
};

describe('AC-20 / AC-21 type contract (enforced by `npm run typecheck`)', () => {
    test('AC-21 viewSpec.qa reads as string | undefined', () => {
        const readQa = (spec: Spec): string | undefined => spec.viewSpec.qa;

        expect([withQa, withoutQa].map(readQa)).toEqual(['string-qa', undefined]);
        expect([nonString, textInputProps, numberInputProps]).toHaveLength(3);
    });
});
