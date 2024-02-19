import {NumberSpec, SpecTypes, StringSpec} from '../../../../../core';

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

export const PASSWORD_SPEC: Record<string, StringSpec> = {
    default: {
        type: SpecTypes.String,
        pattern: '^[-_a-zA-Z0-9/.]+$',
        patternError: 'Pattern error',
        viewSpec: {
            type: 'password',
            layout: 'row',
            layoutTitle: 'Password',
            placeholder: 'placeholder text',
        },
    },
    generateRandomValueButton: {
        type: SpecTypes.String,
        pattern: '^[-_a-zA-Z0-9/.]+$',
        patternError: 'Pattern error',
        viewSpec: {
            type: 'password',
            layout: 'row',
            layoutTitle: 'Password',
            placeholder: 'placeholder text',
            generateRandomValueButton: true,
        },
    },
    defaultValue: {
        defaultValue: 'value',
        type: SpecTypes.String,
        pattern: '^[-_a-zA-Z0-9/.]+$',
        patternError: 'Pattern error',
        viewSpec: {
            type: 'password',
            layout: 'row',
            layoutTitle: 'Password',
            placeholder: 'placeholder text',
        },
    },
};

export const STRING_SPEC: Record<string, StringSpec> = {
    default: {
        type: SpecTypes.String,
        viewSpec: {
            type: 'base',
            layout: 'row',
            layoutTitle: 'Name',
            placeholder: 'placeholder text',
        },
    },
    errorMinLength: {
        minLength: BigInt(1),
        type: SpecTypes.String,
        viewSpec: {
            type: 'base',
            layout: 'row',
            layoutTitle: 'Name',
            placeholder: 'placeholder text',
        },
    },
    errorMaxLength: {
        maxLength: BigInt(1),
        type: SpecTypes.String,
        viewSpec: {
            type: 'base',
            layout: 'row',
            layoutTitle: 'Name',
            placeholder: 'placeholder text',
        },
    },
    errorPatternError: {
        pattern: '^.{1,1}$',
        patternError: 'Pattern Error',
        type: SpecTypes.String,
        viewSpec: {
            type: 'base',
            layout: 'row',
            layoutTitle: 'Name',
            placeholder: 'placeholder text',
        },
    },
};
