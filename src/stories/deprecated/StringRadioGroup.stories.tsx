import React from 'react';

import type {StoryFn} from '@storybook/react';

import type {StringSpec} from '../../lib/deprecated';
import {RadioGroup as RadioGroupBase, SpecTypes} from '../../lib/deprecated';

import {InputPreview} from './components';

export default {
    title: 'Deprecated/String/RadioGroup',
    component: RadioGroupBase,
};

const baseSpec: StringSpec = {
    type: SpecTypes.String,
    enum: ['foo', 'bar', 'rab'],
    description: {
        foo: 'Option 1',
        bar: 'Option 2',
        rab: 'Option 3',
    },
    viewSpec: {
        type: 'radio_group',
        layout: 'row',
        layoutTitle: 'RadioGroup',
        radioGroupParams: {
            disabled: {
                foo: true,
            },
        },
    },
};

const excludeOptions = [
    'minLength',
    'maxLength',
    'pattern',
    'patternError',
    'maximum',
    'minimum',
    'validator',
    'format',
    'viewSpec.type',
    'viewSpec.sizeParams',
    'viewSpec.monacoParams',
    'viewSpec.textContentParams',
    'viewSpec.fileInput',
    'viewSpec.dateInput',
    'viewSpec.generateRandomValueButton',
    'viewSpec.placeholder',
    'viewSpec.selectParams',
];

const template = (spec: StringSpec = baseSpec) => {
    const Template: StoryFn<typeof RadioGroupBase> = (__, {viewMode}) => (
        <InputPreview spec={spec} excludeOptions={excludeOptions} viewMode={viewMode} />
    );

    return Template;
};

export const RadioGroup = template();
