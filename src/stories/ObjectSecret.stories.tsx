import React from 'react';

import type {StoryFn} from '@storybook/react';

import type {ObjectSpec} from '../lib';
import {Secret as SecretBase, SpecTypes} from '../lib';

import {InputPreview} from './components';

export default {
    title: 'Object/Secret',
    component: SecretBase,
};

const baseSpec: ObjectSpec = {
    type: SpecTypes.Object,
    properties: {
        raw: {
            type: SpecTypes.String,
            viewSpec: {type: 'base'},
        },
    },
    viewSpec: {
        type: 'secret',
        layout: 'row',
        layoutTitle: 'Secret',
    },
};

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
    'viewSpec.inputProps',
    'viewSpec.layoutProps',
];

const template = (spec: ObjectSpec = baseSpec) => {
    const Template: StoryFn<typeof SecretBase> = (__, {viewMode}) => (
        <InputPreview spec={spec} excludeOptions={excludeOptions} viewMode={viewMode} />
    );

    return Template;
};

export const Secret = template();
