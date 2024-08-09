import {FormValue, ObjectSpec, SpecTypes} from '../../../../../core';

export const TIME_RANGE_SELECTOR: Record<string, ObjectSpec> = {
    default: {
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
    },
    required: {
        type: SpecTypes.Object,
        properties: {
            start: {
                required: true,
                type: SpecTypes.String,
                viewSpec: {
                    type: 'select',
                    layout: 'row',
                    layoutTitle: 'Start of launch',
                },
            },
            end: {
                required: true,
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
    },
    desription: {
        type: SpecTypes.Object,
        properties: {
            start: {
                type: SpecTypes.String,
                viewSpec: {
                    type: 'select',
                    layout: 'row',
                    layoutTitle: 'Start of launch',
                    layoutDescription: 'End of launch Description',
                },
            },
            end: {
                type: SpecTypes.String,
                viewSpec: {
                    type: 'select',
                    layout: 'row',
                    layoutTitle: 'End of launch',
                    layoutDescription: 'End of launch Description',
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
