import React from 'react';

import {StoryFn} from '@storybook/react';

import {ArrayBase, ArraySpec, SpecTypes} from '../lib';

import {InputPreview} from './components';

export default {
    title: 'Array/Base',
    component: ArrayBase,
};

const spec: ArraySpec = {
    type: SpecTypes.Array,
    items: {
        type: SpecTypes.String,
        viewSpec: {
            type: 'base',
            layout: 'row',
            layoutTitle: 'Element',
        },
    },
    viewSpec: {
        type: 'base',
        layout: 'accordeon',
        layoutTitle: 'Elements',
        layoutOpen: true,
        itemLabel: 'Add element',
    },
};

const value = ['foo', 'bar', 'rab', 'oof'];

const excludeOptions = [
    'enum',
    'description',
    'viewSpec.type',
    'viewSpec.table',
    'viewSpec.placeholder',
    'viewSpec.selectParams',
    'viewSpec.inputProps',
];

const template = () => {
    const Template: StoryFn<typeof ArrayBase> = (__, {viewMode}) => (
        <InputPreview
            spec={spec}
            value={value}
            excludeOptions={excludeOptions}
            viewMode={viewMode}
        />
    );

    return Template;
};

export const Base = template();
