import React from 'react';

import {StoryFn} from '@storybook/react';

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
        textContentParams: {
            text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit',
            icon: 'TriangleExclamation',
            iconColor: 'warning',
        },
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
    'viewSpec.fileInput',
    'viewSpec.dateInput',
    'viewSpec.copy',
    'viewSpec.selectParams',
    'viewSpec.generateRandomValueButton',
    'viewSpec.inputProps',
];

const value = 'value';

const template = (spec: StringSpec = baseSpec) => {
    const Template: StoryFn<typeof TextContent> = (__, {viewMode}) => (
        <InputPreview
            spec={spec}
            excludeOptions={excludeOptions}
            viewMode={viewMode}
            value={value}
        />
    );

    return Template;
};

export const Text = template();

export const Label = template({
    ...baseSpec,
    viewSpec: {
        ...baseSpec.viewSpec,
        textContentParams: {
            text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit',
            themeLabel: 'info',
            icon: 'CircleInfo',
        },
    },
});

export const Alert = template({
    ...baseSpec,
    viewSpec: {
        ...baseSpec.viewSpec,
        textContentParams: {
            text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit',
            themeAlert: 'info',
            titleAlert: 'Title alert',
        },
    },
});
