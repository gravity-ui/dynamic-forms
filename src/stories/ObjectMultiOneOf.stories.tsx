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
    },
    description: {
        external: 'External candidate',
        internal: 'Internal candidate',
    },
    viewSpec: {
        type: 'multi_oneof',
        layout: 'row',
        layoutTitle: 'Multi OneOf',
        placeholder: 'placeholder text',
    },
};

const excludeOptions = ['items', 'viewSpec.type', 'viewSpec.itemLabel', 'viewSpec.table'];

const value = {
    external: {
        name: 'Bar',
        age: 12345,
        license: true,
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
