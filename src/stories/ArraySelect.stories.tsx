import React from 'react';

import {ComponentStory} from '@storybook/react';

import {ArraySpec, MultiSelect, SpecTypes} from '../lib';

import {InputPreview} from './components';

export default {
    title: 'Array/Select',
    component: MultiSelect,
};

const spec: ArraySpec = {
    type: SpecTypes.Array,
    enum: ['foo', 'bar', 'rab', 'oof'],
    description: {
        foo: 'Option 1',
        bar: 'Option 2',
        rab: 'Option 3',
        oof: 'Option 4',
    },
    viewSpec: {
        type: 'select',
        layout: 'row',
        layoutTitle: 'Select',
        placeholder: 'placeholder text',
    },
};

const excludeOptions = ['items', 'viewSpec.type', 'viewSpec.itemLabel', 'viewSpec.table'];

const template = () => {
    const Template: ComponentStory<typeof MultiSelect> = (__, {viewMode}) => (
        <InputPreview spec={spec} excludeOptions={excludeOptions} viewMode={viewMode} />
    );

    return Template;
};

export const Select = template();
