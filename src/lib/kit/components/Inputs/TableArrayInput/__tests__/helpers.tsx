import React from 'react';

import {ArraySpec, FormValue, Spec, SpecTypes} from '../../../../../core';

import {DynamicForm as BaseDynamicForm} from '~playwright/core/DynamicForm';

export const TABLE_ARRAY_INPUT: Record<string, ArraySpec> = {
    default: {
        type: SpecTypes.Array,
        items: {
            type: SpecTypes.Object,
            properties: {
                name: {
                    type: SpecTypes.String,
                    viewSpec: {
                        type: 'base',
                        layout: 'table_item',
                    },
                },
                age: {
                    type: SpecTypes.Number,
                    viewSpec: {
                        type: 'base',
                        layout: 'table_item',
                    },
                },
                size: {
                    type: SpecTypes.Array,
                    enum: ['s', 'm', 'l'],
                    description: {
                        s: 'Small',
                        m: 'Medium',
                        l: 'Large',
                    },
                    viewSpec: {
                        type: 'select',
                        layout: 'table_item',
                    },
                },
                license: {
                    type: SpecTypes.Boolean,
                    viewSpec: {
                        type: 'base',
                        layout: 'table_item',
                    },
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
                {
                    label: 'Name',
                    property: 'name',
                },
                {
                    label: 'Age',
                    property: 'age',
                },
                {
                    label: 'Size',
                    property: 'size',
                },
                {
                    label: 'Driver license',
                    property: 'license',
                },
            ],
        },
    },
    defaultValue: {
        defaultValue: [
            {
                name: 'Foo',
                age: 13,
                license: false,
            },
            {
                name: 'Bar',
                age: 37,
                license: true,
            },
        ],
        type: SpecTypes.Array,
        items: {
            type: SpecTypes.Object,
            properties: {
                name: {
                    type: SpecTypes.String,
                    viewSpec: {
                        type: 'base',
                        layout: 'table_item',
                    },
                },
                age: {
                    type: SpecTypes.Number,
                    viewSpec: {
                        type: 'base',
                        layout: 'table_item',
                    },
                },
                size: {
                    type: SpecTypes.Array,
                    enum: ['s', 'm', 'l'],
                    description: {
                        s: 'Small',
                        m: 'Medium',
                        l: 'Large',
                    },
                    viewSpec: {
                        type: 'select',
                        layout: 'table_item',
                    },
                },
                license: {
                    type: SpecTypes.Boolean,
                    viewSpec: {
                        type: 'base',
                        layout: 'table_item',
                    },
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
                {
                    label: 'Name',
                    property: 'name',
                },
                {
                    label: 'Age',
                    property: 'age',
                },
                {
                    label: 'Size',
                    property: 'size',
                },
                {
                    label: 'Driver license',
                    property: 'license',
                },
            ],
        },
    },
    required: {
        required: true,
        defaultValue: [
            {
                name: 'Foo',
                age: 13,
                license: false,
            },
            {
                name: 'Bar',
                age: 37,
                license: true,
            },
        ],
        type: SpecTypes.Array,
        items: {
            type: SpecTypes.Object,
            properties: {
                name: {
                    type: SpecTypes.String,
                    viewSpec: {
                        type: 'base',
                        layout: 'table_item',
                    },
                },
                age: {
                    type: SpecTypes.Number,
                    viewSpec: {
                        type: 'base',
                        layout: 'table_item',
                    },
                },
                size: {
                    type: SpecTypes.Array,
                    enum: ['s', 'm', 'l'],
                    description: {
                        s: 'Small',
                        m: 'Medium',
                        l: 'Large',
                    },
                    viewSpec: {
                        type: 'select',
                        layout: 'table_item',
                    },
                },
                license: {
                    type: SpecTypes.Boolean,
                    viewSpec: {
                        type: 'base',
                        layout: 'table_item',
                    },
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
                {
                    label: 'Name',
                    property: 'name',
                },
                {
                    label: 'Age',
                    property: 'age',
                },
                {
                    label: 'Size',
                    property: 'size',
                },
                {
                    label: 'Driver license',
                    property: 'license',
                },
            ],
        },
    },
    errorMaxLength: {
        maxLength: BigInt(2),
        defaultValue: [
            {
                name: 'Foo',
                age: 13,
                license: false,
            },
            {
                name: 'Bar',
                age: 37,
                license: true,
            },
        ],
        type: SpecTypes.Array,
        items: {
            type: SpecTypes.Object,
            properties: {
                name: {
                    type: SpecTypes.String,
                    viewSpec: {
                        type: 'base',
                        layout: 'table_item',
                    },
                },
                age: {
                    type: SpecTypes.Number,
                    viewSpec: {
                        type: 'base',
                        layout: 'table_item',
                    },
                },
                size: {
                    type: SpecTypes.Array,
                    enum: ['s', 'm', 'l'],
                    description: {
                        s: 'Small',
                        m: 'Medium',
                        l: 'Large',
                    },
                    viewSpec: {
                        type: 'select',
                        layout: 'table_item',
                    },
                },
                license: {
                    type: SpecTypes.Boolean,
                    viewSpec: {
                        type: 'base',
                        layout: 'table_item',
                    },
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
                {
                    label: 'Name',
                    property: 'name',
                },
                {
                    label: 'Age',
                    property: 'age',
                },
                {
                    label: 'Size',
                    property: 'size',
                },
                {
                    label: 'Driver license',
                    property: 'license',
                },
            ],
        },
    },
    errorMinLength: {
        minLength: BigInt(4),
        defaultValue: [
            {
                name: 'Foo',
                age: 13,
                license: false,
            },
            {
                name: 'Bar',
                age: 37,
                license: true,
            },
        ],
        type: SpecTypes.Array,
        items: {
            type: SpecTypes.Object,
            properties: {
                name: {
                    type: SpecTypes.String,
                    viewSpec: {
                        type: 'base',
                        layout: 'table_item',
                    },
                },
                age: {
                    type: SpecTypes.Number,
                    viewSpec: {
                        type: 'base',
                        layout: 'table_item',
                    },
                },
                size: {
                    type: SpecTypes.Array,
                    enum: ['s', 'm', 'l'],
                    description: {
                        s: 'Small',
                        m: 'Medium',
                        l: 'Large',
                    },
                    viewSpec: {
                        type: 'select',
                        layout: 'table_item',
                    },
                },
                license: {
                    type: SpecTypes.Boolean,
                    viewSpec: {
                        type: 'base',
                        layout: 'table_item',
                    },
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
                {
                    label: 'Name',
                    property: 'name',
                },
                {
                    label: 'Age',
                    property: 'age',
                },
                {
                    label: 'Size',
                    property: 'size',
                },
                {
                    label: 'Driver license',
                    property: 'license',
                },
            ],
        },
    },
};

export const VALUE: Record<string, FormValue> = {
    array: [
        {
            name: 'Foo',
            age: 13,
            license: false,
        },
        {
            name: 'Bar',
            age: 37,
            license: true,
        },
    ],
};

export const DynamicForm = ({spec}: {spec: Spec}) => {
    return (
        <div style={{width: 600}}>
            <BaseDynamicForm spec={spec} />
        </div>
    );
};
