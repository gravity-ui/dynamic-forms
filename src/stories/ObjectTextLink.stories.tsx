import React from 'react';

import {ComponentStory} from '@storybook/react';

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
                layout: 'row',
                layoutTitle: 'Text Link',
                placeholder: 'placeholder text',
            },
        },
    },
    viewSpec: {
        type: 'text_link',
    },
};

const excludeOptions = ['description', 'validator', 'viewSpec'];

const template = (spec: ObjectSpec = baseSpec) => {
    const Template: ComponentStory<typeof TextLinkBase> = (__, {viewMode}) => (
        <InputPreview spec={spec} excludeOptions={excludeOptions} viewMode={viewMode} />
    );

    return Template;
};

export const TextLink = template();
