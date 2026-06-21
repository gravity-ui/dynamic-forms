import type {FormValue, StringSpec} from '../../../../../core';
import {SpecTypes} from '../../../../../core';

export const COLOR_PICKER: Record<string, StringSpec> = {
    default: {
        type: SpecTypes.String,
        viewSpec: {
            type: 'color_picker',
            layout: 'row',
            layoutTitle: 'Color Picker',
        },
    },
    full: {
        type: SpecTypes.String,
        required: true,
        viewSpec: {
            disabled: true,
            type: 'color_picker',
            layout: 'row',
            layoutTitle: 'Color Picker',
            layoutDescription: 'description',
        },
    },
    defaultValue: {
        defaultValue: '#5282ff',
        type: SpecTypes.String,
        viewSpec: {
            type: 'color_picker',
            layout: 'row',
            layoutTitle: 'Color Picker',
        },
    },
    layoutTransparent: {
        type: SpecTypes.String,
        viewSpec: {
            type: 'color_picker',
            layout: 'transparent',
            layoutTitle: 'Color Picker',
        },
    },
    row_verbose: {
        type: SpecTypes.String,
        viewSpec: {
            type: 'color_picker',
            layout: 'row_verbose',
            layoutTitle: 'Color Picker',
            layoutDescription: 'description',
        },
    },
};

export const VALUE: FormValue = '#5282ff';
