import React from 'react';

import {StoryFn} from '@storybook/react';

import {ObjectBase, ObjectSpec, SpecTypes} from '../lib';

import {InputPreview} from './components';

export default {
    title: 'Object/Base',
    component: ObjectBase,
};

const baseSpec: ObjectSpec = {
    type: SpecTypes.Object,
    properties: {
        name: {
            type: SpecTypes.String,
            viewSpec: {
                type: 'base',
                layout: 'row',
                layoutTitle: 'Name',
            },
        },
        age: {
            type: SpecTypes.Number,
            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Age'},
        },
        license: {
            type: SpecTypes.Boolean,
            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'License'},
        },
    },
    viewSpec: {
        type: 'base',
        layout: 'accordeon',
        layoutTitle: 'Candidate',
        layoutOpen: true,
    },
};

const value = {name: 'Foo', age: 13, license: false};

const excludeOptions = [
    'description',
    'viewSpec.type',
    'viewSpec.oneOfParams',
    'viewSpec.delimiter',
    'viewSpec.inputProps',
];

const template = (spec: ObjectSpec = baseSpec) => {
    const Template: StoryFn<typeof ObjectBase> = (__, {viewMode}) => (
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
