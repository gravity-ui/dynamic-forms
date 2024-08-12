import {FormValue, ObjectSpec, SpecTypes} from '../../../../../core';

const ENUM_START = [
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
];

const ENUM_END = [
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
];

export const TIME_RANGE_SELECTOR: Record<string, ObjectSpec> = {
    default: {
        type: SpecTypes.Object,
        properties: {
            start: {
                enum: ENUM_START,
                type: SpecTypes.String,
                viewSpec: {
                    type: 'select',
                    layout: 'row',
                    layoutTitle: 'Start of launch',
                    placeholder: '00:00',
                },
            },
            end: {
                type: SpecTypes.String,
                enum: ENUM_END,
                viewSpec: {
                    type: 'select',
                    layout: 'row',
                    layoutTitle: 'End of launch',
                    placeholder: '01:00',
                },
            },
        },
        viewSpec: {
            type: 'time_range_selector',
            layout: 'transparent',
        },
    },
    defaultValue: {
        defaultValue: {
            start: '03:00',
            end: '06:00',
        },
        type: SpecTypes.Object,
        properties: {
            start: {
                type: SpecTypes.String,
                enum: ENUM_START,
                viewSpec: {
                    type: 'select',
                    layout: 'row',
                    layoutTitle: 'Start of launch',
                    placeholder: '00:00',
                },
            },
            end: {
                type: SpecTypes.String,
                enum: ENUM_END,
                viewSpec: {
                    type: 'select',
                    layout: 'row',
                    layoutTitle: 'End of launch',
                    placeholder: '01:00',
                },
            },
        },
        viewSpec: {
            type: 'time_range_selector',
            layout: 'transparent',
        },
    },
    required: {
        type: SpecTypes.Object,
        properties: {
            start: {
                required: true,
                type: SpecTypes.String,
                enum: ENUM_START,
                viewSpec: {
                    type: 'select',
                    layout: 'row',
                    layoutTitle: 'Start of launch',
                    placeholder: '00:00',
                },
            },
            end: {
                required: true,
                type: SpecTypes.String,
                enum: ENUM_END,
                viewSpec: {
                    type: 'select',
                    layout: 'row',
                    layoutTitle: 'End of launch',
                    placeholder: '01:00',
                },
            },
        },
        viewSpec: {
            type: 'time_range_selector',
            layout: 'transparent',
        },
    },
    desription: {
        type: SpecTypes.Object,
        properties: {
            start: {
                type: SpecTypes.String,
                enum: ENUM_START,
                viewSpec: {
                    type: 'select',
                    layout: 'row',
                    layoutTitle: 'Start of launch',
                    layoutDescription: 'End of launch Description',
                    placeholder: '00:00',
                },
            },
            end: {
                type: SpecTypes.String,
                enum: ENUM_END,
                viewSpec: {
                    type: 'select',
                    layout: 'row',
                    layoutTitle: 'End of launch',
                    layoutDescription: 'End of launch Description',
                    placeholder: '01:00',
                },
            },
        },
        viewSpec: {
            type: 'time_range_selector',
            layout: 'transparent',
        },
    },
};

export const VALUE: FormValue = {
    start: '10:00',
    end: '20:00',
};
