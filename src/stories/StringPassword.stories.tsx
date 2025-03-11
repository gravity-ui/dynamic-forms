import React from 'react';

import type {StoryFn} from '@storybook/react';

import type {StringSpec} from '../lib';
import {SpecTypes, Text} from '../lib';

import {InputPreview} from './components';

export default {
    title: 'String/Password',
    component: Text,
};

const baseSpec: StringSpec = {
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
};

const excludeOptions = [
    'maximum',
    'minimum',
    'format',
    'enum',
    'description',
    'viewSpec.type',
    'viewSpec.sizeParams',
    'viewSpec.monacoParams',
    'viewSpec.textContentParams',
    'viewSpec.fileInput',
    'viewSpec.dateInput',
    'viewSpec.copy',
    'viewSpec.selectParams',
];

const template = (spec: StringSpec = baseSpec) => {
    const Template: StoryFn<typeof Text> = (__, {viewMode}) => (
        <InputPreview spec={spec} excludeOptions={excludeOptions} viewMode={viewMode} />
    );

    return Template;
};

export const Password = template();
