// Type-level tests for `viewSpec.qa` (#462): checked by `tsc`, not Jest (SWC doesn't type-check).
import type {NumberSpec, Spec, StringSpec} from '../../core';
import {SpecTypes} from '../../core';
import type {NumberProps, TextProps} from '../components';

// `viewSpec.qa` is an optional string.
const withQa: StringSpec = {type: SpecTypes.String, viewSpec: {type: 'base', qa: 'string-qa'}};
const withoutQa: Spec = {type: SpecTypes.Number, viewSpec: {type: 'base'}};
const nonString: Spec = {
    type: SpecTypes.Object,
    viewSpec: {
        type: 'base',
        // @ts-expect-error qa must be a string
        qa: 1,
    },
};

// `qa` stays excluded from the published input-props types.
const textInputProps: StringSpec<undefined, TextProps> = {
    type: SpecTypes.String,
    viewSpec: {
        type: 'base',
        inputProps: {
            // @ts-expect-error qa is not part of TextProps
            qa: 'x',
        },
    },
};
const numberInputProps: NumberSpec<undefined, NumberProps> = {
    type: SpecTypes.Number,
    viewSpec: {
        type: 'base',
        inputProps: {
            // @ts-expect-error qa is not part of NumberProps
            qa: 'x',
        },
    },
};

describe('type contract (enforced by `npm run typecheck`)', () => {
    test('viewSpec.qa reads as string | undefined', () => {
        const readQa = (spec: Spec): string | undefined => spec.viewSpec.qa;

        expect([withQa, withoutQa].map(readQa)).toEqual(['string-qa', undefined]);
        expect([nonString, textInputProps, numberInputProps]).toHaveLength(3);
    });
});
