import React from 'react';

import {StoryFn} from '@storybook/react';

import {ObjectSpec, SpecTypes, TextLink as TextLinkBase} from '../lib';

import {InputPreview} from './components';

export default {
    title: 'Object/TextLink',
    component: TextLinkBase,
};

const baseSpec: ObjectSpec = {
    type: SpecTypes.Object,
    properties: {
        text: {
            type: SpecTypes.String,
            viewSpec: {
                type: 'base',
                placeholder: 'placeholder text',
            },
        },
    },
    viewSpec: {
        type: 'text_link',
        layout: 'row',
        layoutTitle: 'Text Link',
    },
};

const value = {link: 'https://gravity-ui.com'};

const excludeOptions = [
    'description',
    'validator',
    'viewSpec.type',
    'viewSpec.order',
    'viewSpec.layoutOpen',
    'viewSpec.disabled',
    'viewSpec.oneOfParams',
    'viewSpec.placeholder',
    'viewSpec.delimiter',
];

const template = (spec: ObjectSpec = baseSpec) => {
    const Template: StoryFn<typeof TextLinkBase> = (__, {viewMode}) => (
        <InputPreview
            spec={spec}
            excludeOptions={excludeOptions}
            value={value}
            viewMode={viewMode}
        />
    );

    return Template;
};

export const TextLink = template();
