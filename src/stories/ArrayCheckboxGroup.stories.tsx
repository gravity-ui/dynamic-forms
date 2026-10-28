import React from 'react';

import type {StoryFn} from '@storybook/react';

import type {ArraySpec} from '../lib';
import {CheckboxGroup as CheckboxGroupBase, SpecTypes} from '../lib';

import {InputPreview} from './components';

export default {
    title: 'Array/CheckboxGroup',
    component: CheckboxGroupBase,
};

const spec: ArraySpec = {
    type: SpecTypes.Array,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    description: {
        monday: 'Mon',
        tuesday: 'Tue',
        wednesday: 'Wed',
        thursday: 'Thu',
        friday: 'Fri',
        saturday: 'Sat',
        sunday: 'Sun',
    },
    viewSpec: {
        type: 'checkbox_group',
        layout: 'row',
        layoutTitle: 'Days of the week',
        checkboxGroupParams: {
            disabled: {
                monday: true,
            },
        },
    },
};

const excludeOptions = [
    'items',
    'viewSpec.type',
    'viewSpec.itemLabel',
    'viewSpec.table',
    'viewSpec.itemPrefix',
    'viewSpec.addButtonPosition',
    'viewSpec.selectParams',
    'viewSpec.inputProps',
    'viewSpec.placeholder',
    'viewSpec.layoutOpen',
    'viewSpec.layoutProps',
];

const template = () => {
    const Template: StoryFn<typeof CheckboxGroupBase> = (__, {viewMode}) => (
        <InputPreview spec={spec} excludeOptions={excludeOptions} viewMode={viewMode} />
    );

    return Template;
};

export const CheckboxGroup = template();
