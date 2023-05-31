import React from 'react';

import {ComponentStory} from '@storybook/react';

import {ObjectSpec, OneOfType as OneOfTypeBase, SpecTypes} from '../lib';

import {InputPreview} from './components';

export default {
    title: 'Object/OneOfType',
    component: OneOfTypeBase,
};

const baseSpec: ObjectSpec = {
    type: SpecTypes.Object,
    properties: {
        array: {
            required: true,
            type: SpecTypes.Array,
            items: {
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                    layout: 'transparent',
                    layoutTitle: 'Element',
                },
            },
            viewSpec: {
                type: 'base',
                layout: 'row',
                layoutTitle: 'Array',
                layoutOpen: true,
                itemLabel: 'Add element',
            },
        },
        boolean: {
            type: SpecTypes.Boolean,
            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Boolean'},
        },
        number: {
            required: true,
            type: SpecTypes.Number,
            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Number'},
        },
        object: {
            required: true,
            type: SpecTypes.Object,
            properties: {
                name: {
                    type: SpecTypes.String,
                    viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Name'},
                },
                age: {
                    type: SpecTypes.Number,
                    viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Age'},
                },
                license: {
                    type: SpecTypes.Boolean,
                    viewSpec: {type: 'base', layout: 'row', layoutTitle: 'License'},
                },
            },
            viewSpec: {
                type: 'base',
                layout: 'transparent',
                layoutTitle: 'Object',
                layoutOpen: true,
            },
        },
        string: {
            required: true,
            type: SpecTypes.String,
            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'String'},
        },
    },
    viewSpec: {
        type: 'oneof_type',
        layout: 'row',
        layoutTitle: 'Candidate',
    },
};

const excludeOptions = ['viewSpec.type', 'viewSpec.layoutOpen'];

const template = (spec: ObjectSpec = baseSpec) => {
    const Template: ComponentStory<typeof OneOfTypeBase> = (__, {viewMode}) => (
        <InputPreview spec={spec} excludeOptions={excludeOptions} viewMode={viewMode} />
    );

    return Template;
};

export const OneOfType = template();
