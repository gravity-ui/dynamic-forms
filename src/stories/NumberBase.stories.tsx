import React from 'react';

import type {StoryFn} from '@storybook/react';

import type {NumberSpec} from '../lib';
import {NumInput, SpecTypes} from '../lib';

import {InputPreview} from './components';

export default {
    title: 'Number/Base',
    component: NumInput,
};

const baseSpec: NumberSpec = {
    type: SpecTypes.Number,
    viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Age', placeholder: 'placeholder text'},
};

const excludeOptions = ['viewSpec.type'];

const template = (spec: NumberSpec = baseSpec) => {
    const Template: StoryFn<typeof NumInput> = (__, {viewMode}) => (
        <InputPreview spec={spec} excludeOptions={excludeOptions} viewMode={viewMode} />
    );

    return Template;
};

export const Base = template();
