import React from 'react';

import type {StoryFn} from '@storybook/react';

import type {BooleanSpec} from '../../lib/deprecated';
import {SpecTypes, Switch as SwitchBase} from '../../lib/deprecated';

import {InputPreview} from './components';

export default {
    title: 'Deprecated/Boolean/Switch',
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
