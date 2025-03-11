import type {StringSpec} from '../../../../../core';
import {SpecTypes} from '../../../../../core';

export const TEXT_AREA_SPEC: Record<string, StringSpec> = {
    default: {
        type: SpecTypes.String,
        viewSpec: {
            type: 'textarea',
            layout: 'row',
            layoutTitle: 'Description',
            placeholder: 'placeholder text',
        },
    },
    description: {
        type: SpecTypes.String,
        viewSpec: {
            type: 'textarea',
            layout: 'row',
            layoutTitle: 'Description',
            placeholder: 'placeholder text',
            layoutDescription: 'description',
        },
    },
    hidden: {
        type: SpecTypes.String,
        viewSpec: {
            type: 'textarea',
            layout: 'row',
            layoutTitle: 'Description',
            placeholder: 'placeholder text',
            layoutDescription: 'description',
            hidden: true,
        },
    },
    layoutRowVerbose: {
        type: SpecTypes.String,
        viewSpec: {
            type: 'textarea',
            layout: 'row_verbose',
            layoutTitle: 'Description',
            placeholder: 'placeholder text',
            layoutDescription: 'description',
        },
    },
    layoutTableItem: {
        type: SpecTypes.String,
        viewSpec: {
            type: 'textarea',
            layout: 'table_item',
            layoutTitle: 'Description',
            placeholder: 'placeholder text',
            layoutDescription: 'description',
        },
    },
    layoutTransparent: {
        type: SpecTypes.String,
        viewSpec: {
            type: 'textarea',
            layout: 'transparent',
            layoutTitle: 'Description',
            placeholder: 'placeholder text',
            layoutDescription: 'description',
        },
    },
    defaultValue: {
        defaultValue: 'default value',
        type: SpecTypes.String,
        viewSpec: {
            type: 'textarea',
            layout: 'row',
            layoutTitle: 'Description',
            placeholder: 'placeholder text',
        },
    },
    errorMinLength: {
        minLength: BigInt(1),
        type: SpecTypes.String,
        viewSpec: {
            type: 'textarea',
            layout: 'row',
            layoutTitle: 'Description',
            placeholder: 'placeholder text',
        },
    },
    errorMaxLength: {
        maxLength: BigInt(1),
        type: SpecTypes.String,
        viewSpec: {
            type: 'textarea',
            layout: 'row',
            layoutTitle: 'Description',
            placeholder: 'placeholder text',
        },
    },
    errorPatternError: {
        pattern: '^.{1,1}$',
        patternError: 'Pattern Error',
        type: SpecTypes.String,
        viewSpec: {
            type: 'textarea',
            layout: 'row',
            layoutTitle: 'Description',
            placeholder: 'placeholder text',
        },
    },
    disabled: {
        type: SpecTypes.String,
        viewSpec: {
            type: 'textarea',
            layout: 'row',
            layoutTitle: 'Description',
            placeholder: 'placeholder text',
            disabled: true,
        },
    },
};
