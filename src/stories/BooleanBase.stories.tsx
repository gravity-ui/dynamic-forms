import React from 'react';

import {StoryFn} from '@storybook/react';

import {BooleanSpec, Checkbox, SpecTypes} from '../lib';

import {InputPreview} from './components';

export default {
    title: 'Boolean/Base',
    component: Checkbox,
};

const baseSpec: BooleanSpec = {
    type: SpecTypes.Boolean,
    viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Flag'},
};

const excludeOptions = ['viewSpec.type'];

const template = (spec: BooleanSpec = baseSpec) => {
    const Template: StoryFn<typeof Checkbox> = (__, {viewMode}) => (
        <InputPreview spec={spec} excludeOptions={excludeOptions} viewMode={viewMode} />
    );

    return Template;
};

export const Base = template();
