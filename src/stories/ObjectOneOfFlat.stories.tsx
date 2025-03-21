import React from 'react';

import type {StoryFn} from '@storybook/react';

import type {ObjectSpec} from '../lib';
import {OneOfFlat as OneOfFlatBase, SpecTypes} from '../lib';

import {InputPreview} from './components';

export default {
    title: 'Object/OneOfFlat',
    component: OneOfFlatBase,
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
        type: 'oneof_flat',
        layout: 'row',
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
    const Template: StoryFn<typeof OneOfFlatBase> = (__, {viewMode}) => (
        <InputPreview spec={spec} excludeOptions={excludeOptions} viewMode={viewMode} />
    );

    return Template;
};

export const OneOfFlat = template();

export const OneOfFlatCheckbox = template({
    ...baseSpec,
    properties: {
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
    viewSpec: {
        ...baseSpec.viewSpec,
        order: ['empty', 'external'],
        oneOfParams: {
            toggler: 'checkbox',
            booleanMap: {
                true: 'external',
                false: 'empty',
            },
        },
    },
});
