import type {NumberSpec} from '../../../../../core';
import {SpecTypes} from '../../../../../core';

export const NUMBER_SPEC: Record<string, NumberSpec> = {
    default: {
        type: SpecTypes.Number,
        viewSpec: {
            type: 'base',
            layout: 'row',
            layoutTitle: 'Age',
            placeholder: 'placeholder text',
        },
    },
    required: {
        type: SpecTypes.Number,
        required: true,
        viewSpec: {
            type: 'base',
            layout: 'row',
            layoutTitle: 'Age',
            placeholder: 'placeholder text',
        },
    },
    disabled: {
        type: SpecTypes.Number,
        viewSpec: {
            type: 'base',
            layout: 'row',
            layoutTitle: 'Age',
            placeholder: 'placeholder text',
            disabled: true,
        },
    },
    description: {
        type: SpecTypes.Number,
        viewSpec: {
            type: 'base',
            layout: 'row',
            layoutTitle: 'Age',
            placeholder: 'placeholder text',
            layoutDescription: 'description',
        },
    },
    hidden: {
        type: SpecTypes.Number,
        viewSpec: {
            type: 'base',
            layout: 'row',
            layoutTitle: 'Age',
            placeholder: 'placeholder text',
            hidden: true,
        },
    },
    layoutRowVerbose: {
        type: SpecTypes.Number,
        viewSpec: {
            type: 'base',
            layout: 'row_verbose',
            layoutTitle: 'Age',
            placeholder: 'placeholder text',
            layoutDescription: 'description',
        },
    },
    layoutTableItem: {
        type: SpecTypes.Number,
        viewSpec: {
            type: 'base',
            layout: 'table_item',
            layoutTitle: 'Age',
            placeholder: 'placeholder text',
        },
    },
    layoutTransparent: {
        type: SpecTypes.Number,
        viewSpec: {
            type: 'base',
            layout: 'transparent',
            layoutTitle: 'Age',
            placeholder: 'placeholder text',
        },
    },
    defaultValue: {
        defaultValue: 12,
        type: SpecTypes.Number,
        viewSpec: {
            type: 'base',
            layout: 'transparent',
            layoutTitle: 'Age',
            placeholder: 'placeholder text',
        },
    },
};
