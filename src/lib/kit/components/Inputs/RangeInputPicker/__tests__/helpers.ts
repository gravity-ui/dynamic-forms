import type {FormValue, NumberSpec, ObjectSpec} from '../../../../../core';
import {SpecTypes} from '../../../../../core';

const fromTo = (
    extra: Partial<NumberSpec> = {},
    viewExtra: Partial<NumberSpec['viewSpec']> = {},
): NumberSpec => ({
    type: SpecTypes.Number,
    minimum: 0,
    maximum: 100,
    ...extra,
    viewSpec: {
        type: 'base',
        ...viewExtra,
    },
});

export const RANGE_INPUT_PICKER_SPEC: Record<string, ObjectSpec> = {
    default: {
        type: SpecTypes.Object,
        properties: {
            from: fromTo({}, {placeholder: 'from'}),
            to: fromTo({}, {placeholder: 'to'}),
        },
        viewSpec: {
            type: 'range_input_picker',
            layout: 'row',
            layoutTitle: 'Price',
        },
    },
    defaultValue: {
        defaultValue: {from: 25, to: 75},
        type: SpecTypes.Object,
        properties: {
            from: fromTo({}, {placeholder: 'from'}),
            to: fromTo({}, {placeholder: 'to'}),
        },
        viewSpec: {
            type: 'range_input_picker',
            layout: 'row',
            layoutTitle: 'Price',
        },
    },
    required: {
        type: SpecTypes.Object,
        properties: {
            from: fromTo({required: true}, {placeholder: 'from'}),
            to: fromTo({required: true}, {placeholder: 'to'}),
        },
        viewSpec: {
            type: 'range_input_picker',
            layout: 'row',
            layoutTitle: 'Price',
        },
    },
    disabled: {
        type: SpecTypes.Object,
        properties: {
            from: fromTo({}, {placeholder: 'from'}),
            to: fromTo({}, {placeholder: 'to'}),
        },
        viewSpec: {
            type: 'range_input_picker',
            layout: 'row',
            layoutTitle: 'Price',
            disabled: true,
        },
    },
    description: {
        type: SpecTypes.Object,
        properties: {
            from: fromTo({}, {placeholder: 'from'}),
            to: fromTo({}, {placeholder: 'to'}),
        },
        viewSpec: {
            type: 'range_input_picker',
            layout: 'row',
            layoutTitle: 'Price',
            layoutDescription: 'Range of prices',
        },
    },
};

export const RANGE_INPUT_PICKER_NUMBER_SPEC: Record<string, NumberSpec> = {
    default: {
        type: SpecTypes.Number,
        minimum: 0,
        maximum: 100,
        viewSpec: {
            type: 'range_input_picker',
            layout: 'row',
            layoutTitle: 'Volume',
            placeholder: 'volume',
        },
    },
    defaultValue: {
        defaultValue: 40,
        type: SpecTypes.Number,
        minimum: 0,
        maximum: 100,
        viewSpec: {
            type: 'range_input_picker',
            layout: 'row',
            layoutTitle: 'Volume',
            placeholder: 'volume',
        },
    },
    disabled: {
        type: SpecTypes.Number,
        minimum: 0,
        maximum: 100,
        viewSpec: {
            type: 'range_input_picker',
            layout: 'row',
            layoutTitle: 'Volume',
            placeholder: 'volume',
            disabled: true,
        },
    },
};

export const VALUE: FormValue = {
    from: 20,
    to: 80,
};

export const NUMBER_VALUE: FormValue = 60 as unknown as FormValue;
