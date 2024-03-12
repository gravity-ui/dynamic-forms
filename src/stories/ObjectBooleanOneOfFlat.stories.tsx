import React from 'react';

import {StoryFn} from '@storybook/react';

import {BooleanOneOfFlat as BooleanOneOfFlatBase, ObjectSpec, SpecTypes} from '../lib';

import {InputPreview} from './components';

export default {
    title: 'Object/BooleanOneOfFlat',
    component: BooleanOneOfFlatBase,
};

const baseSpec: ObjectSpec = {
    type: SpecTypes.Object,
    properties: {
        value: {
            type: SpecTypes.Boolean,
            viewSpec: {type: 'base', layout: 'transparent', layoutTitle: ''},
        },
        true: {
            type: SpecTypes.String,
            viewSpec: {type: 'textarea', layout: 'row', layoutTitle: 'Description'},
        },
        false: {
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
    viewSpec: {
        type: 'boolean_oneof_flat',
        layout: 'row',
        layoutTitle: 'Candidate',
        order: ['value', 'false', 'true'],
    },
};

const excludeOptions = ['viewSpec.type', 'viewSpec.placeholder', 'viewSpec.oneOfParams'];

const template = (spec: ObjectSpec = baseSpec) => {
    const Template: StoryFn<typeof BooleanOneOfFlatBase> = (__, {viewMode}) => (
        <InputPreview spec={spec} excludeOptions={excludeOptions} viewMode={viewMode} />
    );

    return Template;
};

export const BooleanOneOfFlat = template();
