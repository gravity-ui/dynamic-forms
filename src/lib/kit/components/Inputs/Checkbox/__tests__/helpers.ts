import type {BooleanSpec, FormValue} from '../../../../../core';
import {SpecTypes} from '../../../../../core';

export const CHECKBOX: Record<string, BooleanSpec> = {
    default: {
        type: SpecTypes.Boolean,
        viewSpec: {
            type: 'base',
            layout: 'row',
            layoutTitle: 'Flag',
        },
    },
    full: {
        type: SpecTypes.Boolean,
        required: true,
        viewSpec: {
            disabled: true,
            type: 'base',
            layout: 'row',
            layoutTitle: 'Flag',
            layoutDescription: 'description',
        },
    },
    defaultValue: {
        defaultValue: true,
        type: SpecTypes.Boolean,
        viewSpec: {
            type: 'base',
            layout: 'row',
            layoutTitle: 'File Input',
        },
    },
    layoutTransparent: {
        type: SpecTypes.Boolean,
        viewSpec: {
            type: 'base',
            layout: 'transparent',
            layoutTitle: 'Flag',
        },
    },
    row_verbose: {
        type: SpecTypes.Boolean,
        viewSpec: {
            type: 'base',
            layout: 'row_verbose',
            layoutTitle: 'File Input',
            layoutDescription: 'description',
        },
    },
};

export const VALUE: FormValue = true;
