import React from 'react';

import {StoryFn} from '@storybook/react';

import {ObjectSpec, SpecTypes, TimeRangeSelector as TimeRangeSelectorBase} from '../lib';

import {InputPreview} from './components';

export default {
    title: 'Object/TimeRangeSelector',
    component: TimeRangeSelectorBase,
};

const baseSpec: ObjectSpec = {
    type: SpecTypes.Object,
    properties: {
        start: {
            type: SpecTypes.String,
            viewSpec: {
                type: 'select',
                layout: 'row',
                layoutTitle: 'Start of launch',
            },
        },
        end: {
            type: SpecTypes.String,
            viewSpec: {
                type: 'select',
                layout: 'row',
                layoutTitle: 'End of launch',
            },
        },
    },
    viewSpec: {
        type: 'time_range_selector',
        layout: 'transparent',
    },
};

const excludeOptions = [
    'description',
    'validator',
    'viewSpec.type',
    'viewSpec.order',
    'viewSpec.layoutOpen',
    'viewSpec.disabled',
    'viewSpec.oneOfParams',
    'viewSpec.placeholder',
    'viewSpec.delimiter',
    'viewSpec.inputProps',
];

const template = (spec: ObjectSpec = baseSpec) => {
    const Template: StoryFn<typeof TimeRangeSelectorBase> = (__, {viewMode}) => (
        <InputPreview spec={spec} excludeOptions={excludeOptions} viewMode={viewMode} />
    );

    return Template;
};

export const TimeRangeSelector = template();
