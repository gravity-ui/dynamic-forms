import type {FormValue, StringSpec} from '../../../../../core';
import {SpecTypes} from '../../../../../core';

export const NUMBER_WITH_SCALE: Record<string, StringSpec> = {
    default: {
        type: SpecTypes.String,
        validator: 'number',
        viewSpec: {
            type: 'number_with_scale',
            layout: 'row',
            layoutTitle: 'Size',
            sizeParams: {
                scale: {
                    sec: {
                        factor: '1000',
                        title: 'sec',
                    },
                    min: {
                        factor: '60000',
                        title: 'min',
                    },
                    hours: {
                        factor: '3600000',
                        title: 'hours',
                    },
                    days: {
                        factor: '86400000',
                        title: 'days',
                    },
                    msec: {
                        factor: '1',
                        title: 'msec',
                    },
                },
                defaultType: 'msec',
                viewType: 'hours',
            },
            placeholder: 'placeholder text',
        },
    },
    defaultValue: {
        defaultValue: '3600000',
        type: SpecTypes.String,
        validator: 'number',
        viewSpec: {
            type: 'number_with_scale',
            layout: 'row',
            layoutTitle: 'Size',
            sizeParams: {
                scale: {
                    sec: {
                        factor: '1000',
                        title: 'sec',
                    },
                    min: {
                        factor: '60000',
                        title: 'min',
                    },
                    hours: {
                        factor: '3600000',
                        title: 'hours',
                    },
                    days: {
                        factor: '86400000',
                        title: 'days',
                    },
                    msec: {
                        factor: '1',
                        title: 'msec',
                    },
                },
                defaultType: 'msec',
                viewType: 'hours',
            },
            placeholder: 'placeholder text',
        },
    },
    required: {
        required: true,
        type: SpecTypes.String,
        validator: 'number',
        viewSpec: {
            type: 'number_with_scale',
            layout: 'row',
            layoutTitle: 'Size',
            sizeParams: {
                scale: {
                    sec: {
                        factor: '1000',
                        title: 'sec',
                    },
                    min: {
                        factor: '60000',
                        title: 'min',
                    },
                    hours: {
                        factor: '3600000',
                        title: 'hours',
                    },
                    days: {
                        factor: '86400000',
                        title: 'days',
                    },
                    msec: {
                        factor: '1',
                        title: 'msec',
                    },
                },
                defaultType: 'msec',
                viewType: 'hours',
            },
            placeholder: 'placeholder text',
        },
    },
    description: {
        type: SpecTypes.String,
        validator: 'number',
        viewSpec: {
            type: 'number_with_scale',
            layout: 'row',
            layoutTitle: 'Size',
            sizeParams: {
                scale: {
                    sec: {
                        factor: '1000',
                        title: 'sec',
                    },
                    min: {
                        factor: '60000',
                        title: 'min',
                    },
                    hours: {
                        factor: '3600000',
                        title: 'hours',
                    },
                    days: {
                        factor: '86400000',
                        title: 'days',
                    },
                    msec: {
                        factor: '1',
                        title: 'msec',
                    },
                },
                defaultType: 'msec',
                viewType: 'hours',
            },
            placeholder: 'placeholder text',
            layoutDescription: 'description',
        },
    },
};

export const VALUE: FormValue = '3600000';
