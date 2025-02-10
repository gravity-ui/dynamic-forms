import React from 'react';

import {StoryFn} from '@storybook/react';

import {MultiOneOf as MultiOneOfBase, ObjectSpec, SpecTypes} from '../lib';

import {InputPreview} from './components';

export default {
    title: 'Object/MultiOneOf',
    component: MultiOneOfBase,
};

const spec: ObjectSpec = {
    type: SpecTypes.Object,
    properties: {
        person: {
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
            },
            viewSpec: {
                type: 'base',
            },
        },
        id: {
            required: true,
            type: SpecTypes.String,
            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Person id'},
        },
        license: {
            required: true,
            type: SpecTypes.Boolean,
            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'license'},
        },
    },
    description: {
        person: 'Person Data',
        id: 'Person id',
        license: 'License',
    },
    viewSpec: {
        type: 'multi_oneof',
        layout: 'row',
        layoutTitle: 'Multi OneOf',
        placeholder: 'placeholder text',
    },
};

const excludeOptions = [
    'items',
    'viewSpec.type',
    'viewSpec.itemLabel',
    'viewSpec.table',
    'viewSpec.oneOfParams',
    'viewSpec.delimiter',
    'viewSpec.inputProps',
    'viewSpec.layoutProps',
];

const value = {
    person: {
        name: 'Bar',
        age: 20,
    },
};

const template = () => {
    const Template: StoryFn<typeof MultiOneOfBase> = (__, {viewMode}) => (
        <InputPreview
            spec={spec}
            excludeOptions={excludeOptions}
            viewMode={viewMode}
            value={value}
        />
    );

    return Template;
};

export const MultiOneOf = template();
