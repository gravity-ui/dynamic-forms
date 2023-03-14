import React from 'react';

import {ComponentStory} from '@storybook/react';

import {ObjectSpec, Secret as SecretBase, SpecTypes} from '../lib';

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
            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Secret'},
        },
    },
    viewSpec: {
        type: 'secret',
    },
};

const excludeOptions = [
    'description',
    'viewSpec.disabled',
    'viewSpec.type',
    'viewSpec.layout',
    'viewSpec.layoutTitle',
    'viewSpec.layoutDescription',
    'viewSpec.layoutOpen',
    'viewSpec.order',
];

const template = (spec: ObjectSpec = baseSpec) => {
    const Template: ComponentStory<typeof SecretBase> = (__, {viewMode}) => (
        <InputPreview spec={spec} excludeOptions={excludeOptions} viewMode={viewMode} />
    );

    return Template;
};

export const Secret = template();
