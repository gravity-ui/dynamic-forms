import type {BooleanSpec, FormValue} from '../../../../../core';
import {SpecTypes} from '../../../../../core';

export const SWITCH: Record<string, BooleanSpec> = {
    default: {
        type: SpecTypes.Boolean,
        viewSpec: {
            type: 'switch',
            layout: 'row',
            layoutTitle: 'Flag',
        },
    },
    full: {
        type: SpecTypes.Boolean,
        required: true,
        viewSpec: {
            disabled: true,
            type: 'switch',
            layout: 'row',
            layoutTitle: 'Flag',
            layoutDescription: 'description',
        },
    },
    defaultValue: {
        defaultValue: true,
        type: SpecTypes.Boolean,
        viewSpec: {
            type: 'switch',
            layout: 'row',
            layoutTitle: 'File Input',
        },
    },
    row_verbose: {
        type: SpecTypes.Boolean,
        viewSpec: {
            type: 'switch',
            layout: 'row_verbose',
            layoutTitle: 'File Input',
            layoutDescription: 'description',
        },
    },
};

export const VALUE: FormValue = true;
