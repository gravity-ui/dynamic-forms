import type {FormValue, StringSpec} from '../../../../../core';
import {SpecTypes} from '../../../../../core';

export const FILE_INPUT: Record<string, StringSpec> = {
    default: {
        type: SpecTypes.String,
        viewSpec: {
            type: 'file_input',
            layout: 'row',
            layoutTitle: 'File Input',
        },
    },
    full: {
        type: SpecTypes.String,
        required: true,
        viewSpec: {
            type: 'file_input',
            disabled: true,
            layout: 'row',
            layoutTitle: 'File Input',
            layoutDescription: 'description',
        },
    },
    defaultValue: {
        defaultValue: 'file',
        type: SpecTypes.String,
        viewSpec: {
            type: 'file_input',
            layout: 'row',
            layoutTitle: 'File Input',
        },
    },
    ignoreText: {
        type: SpecTypes.String,
        viewSpec: {
            type: 'file_input',
            layout: 'row',
            layoutTitle: 'File Input',
            fileInput: {
                ignoreText: true,
            },
        },
    },
    ignoreTextWithDefaultValue: {
        defaultValue: 'file',
        type: SpecTypes.String,
        viewSpec: {
            type: 'file_input',
            layout: 'row',
            layoutTitle: 'File Input',
            fileInput: {
                ignoreText: true,
            },
        },
    },
};

export const VALUE: FormValue = 'FILE';
