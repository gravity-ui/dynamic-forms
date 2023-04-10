import React from 'react';

import {ComponentStory} from '@storybook/react';

import {Select as SelectBase, SpecTypes, StringSpec} from '../lib';

import {InputPreview} from './components';

export default {
    title: 'String/Select',
    component: SelectBase,
};

const baseSpec: StringSpec = {
    type: SpecTypes.String,
    enum: ['foo', 'bar', 'rab', 'oof'],
    description: {
        foo: 'Option 1',
        bar: 'Option 2',
        rab: 'Option 3',
        oof: 'Option 4',
    },
    viewSpec: {
        type: 'select',
        layout: 'row',
        layoutTitle: 'Select',
        placeholder: 'placeholder text',
    },
};

const excludeOptions = [
    'maximum',
    'minimum',
    'format',
    'viewSpec.type',
    'viewSpec.sizeParams',
    'viewSpec.monacoParams',
    'viewSpec.themeLabel',
    'viewSpec.fileInput',
];

const template = (spec: StringSpec = baseSpec) => {
    const Template: ComponentStory<typeof SelectBase> = (__, {viewMode}) => (
        <InputPreview spec={spec} excludeOptions={excludeOptions} viewMode={viewMode} />
    );

    return Template;
};

export const Select = template();
