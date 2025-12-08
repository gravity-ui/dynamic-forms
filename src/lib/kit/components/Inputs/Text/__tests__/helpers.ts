import type {StringSpec} from '../../../../../core';
import {SpecTypes} from '../../../../../core';

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
