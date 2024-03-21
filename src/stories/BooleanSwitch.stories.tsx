import React from 'react';

import {StoryFn} from '@storybook/react';

import {BooleanSpec, SpecTypes, Switch as SwitchBase} from '../lib';

import {InputPreview} from './components';

export default {
    title: 'Boolean/Switch',
    component: SwitchBase,
};

const baseSpec: BooleanSpec = {
    type: SpecTypes.Boolean,
    viewSpec: {type: 'switch', layout: 'row', layoutTitle: 'Flag'},
};

const excludeOptions = ['viewSpec.type', 'viewSpec.inputProps'];

const template = (spec: BooleanSpec = baseSpec) => {
    const Template: StoryFn<typeof SwitchBase> = (__, {viewMode}) => (
        <InputPreview spec={spec} excludeOptions={excludeOptions} viewMode={viewMode} />
    );

    return Template;
};

export const Switch = template();
