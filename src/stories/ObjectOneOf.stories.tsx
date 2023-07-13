import React from 'react';

import {StoryFn} from '@storybook/react';

import {ObjectSpec, OneOf as OneOfBase, SpecTypes} from '../lib';

import {InputPreview} from './components';

export default {
    title: 'Object/OneOf',
    component: OneOfBase,
};

const baseSpec: ObjectSpec = {
    type: SpecTypes.Object,
    properties: {
        internal: {
            required: true,
            type: SpecTypes.String,
            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Person id'},
        },
        empty: {
            required: true,
            type: SpecTypes.Object,
            viewSpec: {type: 'base', layoutTitle: 'Empty'},
        },
        external: {
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
                layoutTitle: 'Person data',
            },
        },
    },
    description: {
        external: 'External candidate',
        internal: 'Internal candidate',
        empty: 'None',
    },
    viewSpec: {
        type: 'oneof',
        layout: 'row',
        layoutTitle: 'Candidate',
        order: ['external', 'internal', 'empty'],
    },
};

const excludeOptions = ['viewSpec.type'];

const template = (spec: ObjectSpec = baseSpec) => {
    const Template: StoryFn<typeof OneOfBase> = (__, {viewMode}) => (
        <InputPreview spec={spec} excludeOptions={excludeOptions} viewMode={viewMode} />
    );

    return Template;
};

export const OneOf = template();
