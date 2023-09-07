import React from 'react';

import {StoryFn} from '@storybook/react';

import {SpecTypes, StringSpec, TextArea as TextAreaBase} from '../lib';

import {InputPreview} from './components';

export default {
    title: 'String/TextArea',
    component: TextAreaBase,
};

const baseSpec: StringSpec = {
    type: SpecTypes.String,
    viewSpec: {
        type: 'textarea',
        layout: 'row',
        layoutTitle: 'Description',
        placeholder: 'placeholder text',
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
    'viewSpec.selectParams',
];

const template = (spec: StringSpec = baseSpec) => {
    const Template: StoryFn<typeof TextAreaBase> = (__, {viewMode}) => (
        <InputPreview spec={spec} excludeOptions={excludeOptions} viewMode={viewMode} />
    );

    return Template;
};

export const TextArea = template();
