import React from 'react';

import {StoryFn} from '@storybook/react';

import {ObjectInline as ObjectInlineBase, ObjectSpec, SpecTypes} from '../lib';

import {InputPreview} from './components';

export default {
    title: 'Object/Inline',
    component: ObjectInlineBase,
};

const baseSpec: ObjectSpec = {
    type: SpecTypes.Object,
    properties: {
        type: {
            type: SpecTypes.String,
            enum: ['first', 'second', 'third'],
            viewSpec: {
                type: 'select',
                placeholder: 'Choose type',
                layout: 'transparent',
                layoutTitle: 'Type',
            },
        },
        name: {
            type: SpecTypes.String,
            viewSpec: {
                type: 'base',
                placeholder: 'Type your name',
                layout: 'transparent',
                layoutTitle: 'Name',
            },
        },
        license: {
            type: SpecTypes.Boolean,
            viewSpec: {
                type: 'base',
                layout: 'transparent',
            },
        },
    },
    viewSpec: {
        type: 'inline',
        layout: 'row',
        layoutTitle: 'Candidate',
        delimiter: {
            type: ':',
            name: '-',
        },
    },
};

const value = {type: 'first', name: 'Foo'};

const excludeOptions = [
    'description',
    'viewSpec.type',
    'viewSpec.oneOfParams',
    'viewSpec.placeholder',
    'viewSpec.inputProps',
    'viewSpec.layoutProps',
];

const template = (spec: ObjectSpec = baseSpec) => {
    const Template: StoryFn<typeof ObjectInlineBase> = (__, {viewMode}) => (
        <InputPreview
            spec={spec}
            value={value}
            excludeOptions={excludeOptions}
            viewMode={viewMode}
        />
    );

    return Template;
};

export const Inline = template();
