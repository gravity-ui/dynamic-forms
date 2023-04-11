import React from 'react';

import {ComponentStory} from '@storybook/react';

import {SpecTypes, StringSpec, Text} from '../lib';

import {InputPreview} from './components';

export default {
    title: 'String/Base',
    component: Text,
};

const baseSpec: StringSpec = {
    type: SpecTypes.String,
    viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Name', placeholder: 'placeholder text'},
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
    'viewSpec.themeLabel',
    'viewSpec.fileInput',
];

const template = (spec: StringSpec = baseSpec) => {
    const Template: ComponentStory<typeof Text> = (__, {viewMode}) => (
        <InputPreview spec={spec} excludeOptions={excludeOptions} viewMode={viewMode} />
    );

    return Template;
};

export const Base = template();
