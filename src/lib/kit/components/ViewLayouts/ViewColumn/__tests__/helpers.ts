import {FormValue, ObjectSpec, SpecTypes} from '../../../../../core';

export const VIEW_COLUMN: ObjectSpec = {
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
                layout: 'row',
                layoutDescription: 'Description for Name',
                layoutTitle: 'Name',
            },
        },
        age: {
            type: SpecTypes.Number,
            viewSpec: {
                type: 'base',
                layout: 'row',
                layoutDescription: 'Description for Age',
                layoutTitle: 'Age',
            },
        },
        license: {
            type: SpecTypes.Boolean,
            viewSpec: {
                type: 'base',
                layout: 'row',
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

export const VALUE: FormValue = {
    name: 'name',
    age: 21,
    license: true,
};
