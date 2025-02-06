import React from 'react';

import {StoryFn} from '@storybook/react';

import {ArraySpec, SpecTypes, TableArrayInput} from '../lib';

import {InputPreview} from './components';

export default {
    title: 'Array/Table',
    component: TableArrayInput,
};

const spec: ArraySpec = {
    type: SpecTypes.Array,
    items: {
        type: SpecTypes.Object,
        properties: {
            name: {
                type: SpecTypes.String,
                viewSpec: {type: 'base', layout: 'table_item'},
            },
            age: {
                type: SpecTypes.Number,
                viewSpec: {type: 'base', layout: 'table_item'},
            },
            size: {
                type: SpecTypes.Array,
                enum: ['s', 'm', 'l'],
                description: {s: 'Small', m: 'Medium', l: 'Large'},
                viewSpec: {type: 'select', layout: 'table_item'},
            },
            license: {
                type: SpecTypes.Boolean,
                viewSpec: {type: 'base', layout: 'table_item'},
            },
        },
        viewSpec: {
            type: '',
        },
    },
    viewSpec: {
        type: 'table',
        layout: 'accordeon',
        layoutTitle: 'Table',
        layoutOpen: true,
        itemLabel: 'Candidate',
        table: [
            {label: 'Name', property: 'name', description: 'Your first name'},
            {label: 'Age', property: 'age'},
            {label: 'Size', property: 'size'},
            {label: 'Driver license', property: 'license'},
        ],
    },
};

const excludeOptions = [
    'enum',
    'description',
    'viewSpec.type',
    'viewSpec.placeholder',
    'viewSpec.itemPrefix',
    'viewSpec.addButtonPosition',
    'viewSpec.selectParams',
    'viewSpec.checkboxGroupParams',
    'viewSpec.inputProps',
    'viewSpec.layoutProps',
];

const value = [
    {name: 'Foo', age: 13, license: false},
    {name: 'Bar', age: 37, license: true},
];

const template = () => {
    const Template: StoryFn<typeof TableArrayInput> = (__, {viewMode}) => (
        <InputPreview
            spec={spec}
            value={value}
            excludeOptions={excludeOptions}
            viewMode={viewMode}
        />
    );

    return Template;
};

export const Table = template();
