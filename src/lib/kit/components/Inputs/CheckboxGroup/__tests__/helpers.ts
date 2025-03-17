import type {ArraySpec, FormValue} from '../../../../../core';
import {SpecTypes} from '../../../../../core';

export const CHECKBOX_GROUP: Record<string, ArraySpec> = {
    default: {
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
    },
    defaultValue: {
        defaultValue: ['monday', 'wednesday'],
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
            layoutDescription: 'Description Days of the week',
            checkboxGroupParams: {
                disabled: {
                    monday: true,
                },
            },
        },
    },
    placementVertical: {
        defaultValue: ['monday', 'wednesday'],
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
            layoutDescription: 'Description Days of the week',
            checkboxGroupParams: {
                placement: 'vertical',
                disabled: {
                    monday: true,
                },
            },
        },
    },
    disabled: {
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
            disabled: true,
        },
    },
};

export const VALUE: Record<string, FormValue> = {
    vertical: ['monday', 'wednesday', 'saturday'],
    horizontal: ['monday', 'wednesday', 'saturday'],
};
