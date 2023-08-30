import React from 'react';

import {StoryFn} from '@storybook/react';

import {Inline as InlineBase, ObjectSpec, SpecTypes} from '../lib';

import {InputPreview} from './components';

export default {
    title: 'Object/Inline',
    component: InlineBase,
};

const baseSpec: ObjectSpec = {
    type: SpecTypes.Object,
    properties: {
        gender: {
            type: SpecTypes.String,
            enum: ['male', 'female', 'other'],
            viewSpec: {type: 'select', placeholder: 'Choose gender'},
        },
        name: {
            type: SpecTypes.Number,
            viewSpec: {type: 'base', placeholder: 'Type your name'},
        },
    },
    viewSpec: {
        type: 'inline',
        layout: 'row',
        layoutTitle: 'Candidate',
    },
};

const value = {gender: 'other', name: 'Foo'};

const excludeOptions = ['description', 'viewSpec.type', 'viewSpec.oneOfParams'];

const template = (spec: ObjectSpec = baseSpec) => {
    const Template: StoryFn<typeof InlineBase> = (__, {viewMode}) => (
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
