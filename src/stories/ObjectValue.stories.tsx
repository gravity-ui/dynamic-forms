import React from 'react';

import {ComponentStory} from '@storybook/react';

import {ObjectSpec, SpecTypes} from '../lib';
import {ObjectValue as ObjectValueBase} from '../lib/kit';

import {InputPreview} from './components';

export default {
    title: 'Object/ObjectValue',
    component: ObjectValueBase,
};

const baseSpec: ObjectSpec = {
    type: SpecTypes.Object,
    properties: {
        value: {
            type: SpecTypes.String,
            viewSpec: {
                type: 'base',
                layout: 'row',
                layoutTitle: 'Value',
                placeholder: 'placeholder text',
            },
        },
    },
    viewSpec: {
        type: 'object_value',
    },
};

const excludeOptions = ['description', 'validator', 'viewSpec', 'required'];

const template = (spec: ObjectSpec = baseSpec) => {
    const Template: ComponentStory<typeof ObjectValueBase> = (__, {viewMode}) => (
        <InputPreview spec={spec} excludeOptions={excludeOptions} viewMode={viewMode} />
    );

    return Template;
};

export const ObjectValue = template();
