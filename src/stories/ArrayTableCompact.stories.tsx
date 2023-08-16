import React from 'react';

import {StoryFn} from '@storybook/react';

import {ArraySpec, SpecTypes, TableCompact as TableCompactBase} from '../lib';

import {InputPreview} from './components';

export default {
    title: 'Array/TableCompact',
    component: TableCompactBase,
};

const spec: ArraySpec = {
    type: SpecTypes.Array,
    items: {
        type: SpecTypes.Object,
        properties: {
            name: {
                type: SpecTypes.String,
                viewSpec: {type: 'base', layout: 'table_item', placeholder: 'placeholder text'},
            },
            size: {
                type: SpecTypes.Array,
                enum: ['s', 'm', 'l'],
                description: {s: 'Small', m: 'Medium', l: 'Large'},
                viewSpec: {type: 'select', layout: 'table_item'},
            },
            age: {
                type: SpecTypes.Number,
                viewSpec: {type: 'base', layout: 'table_item'},
            },
        },
        viewSpec: {
            type: '',
        },
    },
    viewSpec: {
        type: 'table_compact',
        layout: 'row',
        layoutTitle: 'Table',
        layoutOpen: true,
        table: [
            {label: '', property: 'name'},
            {label: '', property: 'age'},
            {label: '', property: 'size'},
        ],
    },
};

const excludeOptions = ['enum', 'description', 'viewSpec.type', 'viewSpec.placeholder'];

const value = [
    {name: 'Foo', age: 13},
    {name: 'Bar', age: 37},
];

const template = () => {
    const Template: StoryFn<typeof TableCompactBase> = (__, {viewMode}) => (
        <InputPreview
            spec={spec}
            value={value}
            excludeOptions={excludeOptions}
            viewMode={viewMode}
        />
    );

    return Template;
};

export const TableCompact = template();
