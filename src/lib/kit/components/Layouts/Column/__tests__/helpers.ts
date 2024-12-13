import {FormValue, ObjectSpec, SpecTypes} from '../../../../../core';

export const COLUMN_CARD: ObjectSpec = {
    defaultValue: {
        name: 'value',
        age: 10,
        license: false,
    },
    type: SpecTypes.Object,
    properties: {
        name: {
            type: SpecTypes.String,
            viewSpec: {
                type: 'base',
                layout: 'column',
                layoutDescription: 'Description for Name',
                layoutTitle: 'Name',
            },
        },
        age: {
            type: SpecTypes.Number,
            viewSpec: {
                type: 'base',
                layout: 'column',
                layoutDescription: 'Description for Age',
                layoutTitle: 'Age',
            },
        },
        license: {
            type: SpecTypes.Boolean,
            viewSpec: {
                type: 'base',
                layout: 'column',
                layoutDescription: 'Description for License',
                layoutTitle: 'License',
            },
        },
    },
    viewSpec: {
        type: 'base',
        layout: 'accordeon',
        layoutTitle: 'Candidate',
        layoutDescription: 'Description for base',
        layoutOpen: true,
    },
};

export const VALUE: Record<string, FormValue> = {
    array: ['value', 'value'],
    object: {
        name: 'name',
        age: 21,
        license: true,
    },
};
