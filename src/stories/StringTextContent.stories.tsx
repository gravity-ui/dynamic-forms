import React from 'react';

import {ComponentStory} from '@storybook/react';

import {SpecTypes, StringSpec, TextContent} from '../lib';

import {InputPreview} from './components';

export default {
    title: 'String/TextContent',
    component: TextContent,
};

const baseSpec: StringSpec = {
    type: SpecTypes.String,
    viewSpec: {
        type: 'text_content',
        layoutDescription: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit',
    },
};

const excludeOptions = [
    'required',
    'maxLength',
    'minLength',
    'pattern',
    'patternError',
    'maximum',
    'minimum',
    'format',
    'enum',
    'description',
    'validator',
    'viewSpec.disabled',
    'viewSpec.type',
    'viewSpec.sizeParams',
    'viewSpec.monacoParams',
    'viewSpec.placeholder',
];

const template = (spec: StringSpec = baseSpec) => {
    const Template: ComponentStory<typeof TextContent> = (__, {viewMode}) => (
        <InputPreview spec={spec} excludeOptions={excludeOptions} viewMode={viewMode} />
    );

    return Template;
};

export const Text = template();

export const Label = template({
    ...baseSpec,
    viewSpec: {...baseSpec.viewSpec, themeLabel: 'info'},
});
