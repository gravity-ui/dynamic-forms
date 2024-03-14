import React from 'react';

import {StoryFn} from '@storybook/react';

import {ArraySpec, MultiSelect, SpecTypes} from '../lib';

import {InputPreview} from './components';

export default {
    title: 'Array/Select',
    component: MultiSelect,
};

const spec: ArraySpec = {
    type: SpecTypes.Array,
    enum: ['foo', 'bar', 'rab', 'oof', 'fooBar', 'fooOof', 'barFoo', 'barOof', 'fooFoo', 'barBar'],
    description: {
        foo: 'Option 1',
        bar: 'Option 2',
        rab: 'Option 3',
        oof: 'Option 4',
        fooBar: 'Option 5',
        fooOof: 'Option 6',
        barFoo: 'Option 7',
        barOof: 'Option 8',
        fooFoo: 'Option 9',
        barBar: 'Option 10',
    },
    viewSpec: {
        type: 'select',
        layout: 'row',
        layoutTitle: 'Select',
        placeholder: 'placeholder text',
        selectParams: {
            filterPlaceholder: 'filter placeholder',
            meta: {
                foo: 'Additional text 1',
                bar: 'Additional text 2',
                rab: 'Additional text 3',
                oof: 'Additional text 4',
                fooBar: 'Additional text 5',
                fooOof: 'Additional text 6',
                barFoo: 'Additional text 7',
                barOof: 'Additional text 8',
                fooFoo: 'Additional text 9',
                barBar: 'Additional text 10',
            },
        },
    },
};

const excludeOptions = [
    'items',
    'viewSpec.type',
    'viewSpec.itemLabel',
    'viewSpec.table',
    'viewSpec.tableWordWrap',
    'viewSpec.itemPrefix',
    'viewSpec.addButtonPosition',
];

const template = () => {
    const Template: StoryFn<typeof MultiSelect> = (__, {viewMode}) => (
        <InputPreview spec={spec} excludeOptions={excludeOptions} viewMode={viewMode} />
    );

    return Template;
};

export const Select = template();
