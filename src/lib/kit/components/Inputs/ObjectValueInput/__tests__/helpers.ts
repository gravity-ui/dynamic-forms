import type {FormValue, ObjectSpec} from '../../../../../core';
import {SpecTypes} from '../../../../../core';

export const OBJECT_VALUE_INPUT: Record<string, ObjectSpec> = {
    default: {
        type: SpecTypes.Object,
        properties: {
            value: {
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                },
            },
        },
        viewSpec: {
            type: 'object_value',
            layout: 'row',
            layoutTitle: 'Object value',
        },
    },
    defaultValue: {
        defaultValue: {
            value: 'value',
        },
        type: SpecTypes.Object,
        properties: {
            value: {
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                },
            },
        },
        viewSpec: {
            type: 'object_value',
            layout: 'row',
            layoutTitle: 'Object value',
        },
    },
    required: {
        required: true,
        type: SpecTypes.Object,
        properties: {
            value: {
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                },
            },
        },
        viewSpec: {
            type: 'object_value',
            layout: 'row',
            layoutTitle: 'Object value',
        },
    },
    desription: {
        type: SpecTypes.Object,
        properties: {
            value: {
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                },
            },
        },
        viewSpec: {
            type: 'object_value',
            layout: 'row',
            layoutTitle: 'Object value',
            layoutDescription: 'Description',
        },
    },
    row_verbose: {
        type: SpecTypes.Object,
        properties: {
            value: {
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                },
            },
        },
        viewSpec: {
            type: 'object_value',
            layout: 'row',
            layoutTitle: 'Object value',
            layoutDescription: 'Description',
        },
    },
};

export const VALUE: Record<string, FormValue> = {
    string: {
        value: 'value',
    },
    boolean: {value: true},
};
