import React from 'react';

import type {StoryFn} from '@storybook/react';

import type {StringSpec} from '../lib';
import {DateInput as DateInputBase, SpecTypes} from '../lib';

import {InputPreview} from './components';

export default {
    title: 'String/DateInput',
    component: DateInputBase,
};

const baseSpec: StringSpec = {
    type: SpecTypes.String,
    viewSpec: {
        type: 'date_input',
        layout: 'row',
        layoutTitle: 'Date Input',
    },
};

const excludeOptions = [
    'maximum',
    'minimum',
    'format',
    'enum',
    'description',
    'viewSpec.type',
    'viewSpec.sizeParams',
    'viewSpec.monacoParams',
    'viewSpec.textContentParams',
    'viewSpec.fileInput',
    'viewSpec.placeholder',
    'viewSpec.layoutOpen',
    'viewSpec.selectParams',
    'viewSpec.generateRandomValueButton',
];

const template = (spec: StringSpec = baseSpec) => {
    const Template: StoryFn<typeof DateInputBase> = (__, {viewMode}) => (
        <InputPreview spec={spec} excludeOptions={excludeOptions} viewMode={viewMode} />
    );

    return Template;
};

export const DateInput = template();
