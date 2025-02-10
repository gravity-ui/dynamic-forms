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
            enum: [
                '00:00',
                '01:00',
                '02:00',
                '03:00',
                '04:00',
                '05:00',
                '06:00',
                '07:00',
                '08:00',
                '09:00',
                '10:00',
                '11:00',
                '12:00',
                '13:00',
                '14:00',
                '15:00',
                '16:00',
                '17:00',
                '18:00',
                '19:00',
                '20:00',
                '21:00',
                '22:00',
            ],
            viewSpec: {
                type: 'select',
                layout: 'row',
                layoutTitle: 'Start of launch',
                placeholder: '00:00',
                selectParams: {
                    filterPlaceholder: 'Start time',
                },
            },
        },
        end: {
            type: SpecTypes.String,
            enum: [
                '01:00',
                '02:00',
                '03:00',
                '04:00',
                '05:00',
                '06:00',
                '07:00',
                '08:00',
                '09:00',
                '10:00',
                '11:00',
                '12:00',
                '13:00',
                '14:00',
                '15:00',
                '16:00',
                '17:00',
                '18:00',
                '19:00',
                '20:00',
                '21:00',
                '22:00',
                '23:00',
            ],
            viewSpec: {
                type: 'select',
                layout: 'row',
                layoutTitle: 'End of launch',
                placeholder: '01:00',
                selectParams: {
                    filterPlaceholder: 'End time',
                },
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
    'viewSpec.layoutProps',
];

const template = (spec: ObjectSpec = baseSpec) => {
    const Template: StoryFn<typeof TimeRangeSelectorBase> = (__, {viewMode}) => (
        <InputPreview spec={spec} excludeOptions={excludeOptions} viewMode={viewMode} />
    );

    return Template;
};

export const TimeRangeSelector = template();
