import React from 'react';

import {StoryFn} from '@storybook/react';

import {NumberWithScale as NumberWithScaleBase, SpecTypes, StringSpec} from '../lib';

import {InputPreview} from './components';

export default {
    title: 'String/NumberWithScale',
    component: NumberWithScaleBase,
};

const baseSpec: StringSpec = {
    type: SpecTypes.String,
    validator: 'number',
    viewSpec: {
        type: 'number_with_scale',
        layout: 'row',
        layoutTitle: 'Size',
        sizeParams: {
            scale: {
                sec: {factor: '1000', title: 'sec'},
                min: {factor: '60000', title: 'min'},
                hours: {factor: '3600000', title: 'hours'},
                days: {factor: '86400000', title: 'days'},
                msec: {factor: '1', title: 'msec'},
            },
            defaultType: 'msec',
            viewType: 'hours',
        },
        placeholder: 'placeholder text',
    },
};

const excludeOptions = [
    'maxLength',
    'minLength',
    'pattern',
    'patternError',
    'enum',
    'description',
    'viewSpec.type',
    'viewSpec.monacoParams',
    'viewSpec.themeLabel',
    'viewSpec.fileInput',
];

const template = (spec: StringSpec = baseSpec) => {
    const Template: StoryFn<typeof NumberWithScaleBase> = (__, {viewMode}) => (
        <InputPreview spec={spec} excludeOptions={excludeOptions} viewMode={viewMode} />
    );

    return Template;
};

export const NumberWithScale = template();
