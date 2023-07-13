import React from 'react';

import {StoryFn} from '@storybook/react';

import {NumberSpec, SpecTypes, Text} from '../lib';

import {InputPreview} from './components';

export default {
    title: 'Number/Base',
    component: Text,
};

const baseSpec: NumberSpec = {
    type: SpecTypes.Number,
    viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Age', placeholder: 'placeholder text'},
};

const excludeOptions = ['viewSpec.type'];

const template = (spec: NumberSpec = baseSpec) => {
    const Template: StoryFn<typeof Text> = (__, {viewMode}) => (
        <InputPreview spec={spec} excludeOptions={excludeOptions} viewMode={viewMode} />
    );

    return Template;
};

export const Base = template();
