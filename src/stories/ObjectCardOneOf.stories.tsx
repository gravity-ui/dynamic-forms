import React from 'react';

import {StoryFn} from '@storybook/react';

import {CardOneOf as CardOneOfBase, ObjectSpec, SpecTypes} from '../lib';

import {InputPreview} from './components';

export default {
    title: 'Object/CardOneOf',
    component: CardOneOfBase,
};

const baseSpec: ObjectSpec = {
    type: SpecTypes.Object,
    properties: {
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
    },
    description: {
        internal: 'Internal candidate',
        empty: 'None',
        external: 'External candidate',
    },
    viewSpec: {
        type: 'card_oneof',
        layoutTitle: 'Candidate',
        order: ['external', 'internal', 'empty'],
    },
};

const excludeOptions = [
    'viewSpec.type',
    'viewSpec.placeholder',
    'viewSpec.delimiter',
    'viewSpec.inputProps',
    'viewSpec.layoutProps',
];

const template = (spec: ObjectSpec = baseSpec) => {
    const Template: StoryFn<typeof CardOneOfBase> = (__, {viewMode}) => (
        <InputPreview spec={spec} excludeOptions={excludeOptions} viewMode={viewMode} />
    );

    return Template;
};

export const CardOneOf = template();
