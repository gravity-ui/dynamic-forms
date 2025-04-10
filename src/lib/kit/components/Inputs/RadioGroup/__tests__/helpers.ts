import type {StringSpec} from '../../../../../core';
import {SpecTypes} from '../../../../../core';

export const RADIO_GROUP: Record<string, StringSpec> = {
    default: {
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
        },
    },
    defaultValue: {
        defaultValue: 'foo',
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
        },
    },
    required: {
        required: true,
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
        },
    },
    description: {
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
            layoutDescription: 'Description',
        },
    },
    disabled: {
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
            layoutDescription: 'Description',
            disabled: true,
        },
    },
    disabledOptions: {
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
            layoutDescription: 'Description',
            radioGroupParams: {
                disabled: {
                    foo: true,
                },
            },
        },
    },
    directionVertical: {
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
            layoutDescription: 'Description',
            radioGroupParams: {
                direction: 'vertical',
            },
        },
    },
};

export const VALUE = 'foo';
