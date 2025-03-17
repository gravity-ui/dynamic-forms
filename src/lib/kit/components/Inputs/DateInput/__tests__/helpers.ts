import type {FormValue, StringSpec} from '../../../../../core';
import {SpecTypes} from '../../../../../core';

export const DATE_INPUT: Record<string, StringSpec> = {
    default: {
        type: SpecTypes.String,
        viewSpec: {
            type: 'date_input',
            layout: 'row',
            layoutTitle: 'Flag',
        },
    },
    full: {
        type: SpecTypes.String,
        required: true,
        viewSpec: {
            disabled: true,
            type: 'date_input',
            layout: 'row',
            layoutTitle: 'Flag',
            layoutDescription: 'description',
        },
    },
    defaultValue: {
        defaultValue: '2020-01-01',
        type: SpecTypes.String,
        viewSpec: {
            type: 'date_input',
            layout: 'row',
            layoutTitle: 'File Input',
        },
    },
    layoutTransparent: {
        type: SpecTypes.String,
        viewSpec: {
            type: 'date_input',
            layout: 'transparent',
            layoutTitle: 'Flag',
        },
    },
    row_verbose: {
        type: SpecTypes.String,
        viewSpec: {
            type: 'date_input',
            layout: 'row_verbose',
            layoutTitle: 'File Input',
            layoutDescription: 'description',
        },
    },
};

export const VALUE: FormValue = '2020-01-01';
