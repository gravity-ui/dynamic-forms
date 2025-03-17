import type {ArraySpec, FormValue, ObjectSpec} from '../../../../core';
import {SpecTypes} from '../../../../core';

export const ACCORDEON_CARD: Record<string, ArraySpec | ObjectSpec> = {
    arraySpec: {
        defaultValue: ['value'],
        type: SpecTypes.Array,
        items: {
            type: SpecTypes.String,
            viewSpec: {
                type: 'base',
                layout: 'row',
                layoutTitle: 'Element',
            },
        },
        viewSpec: {
            type: 'base',
            layout: 'card_accordeon',
            layoutTitle: 'Accordeon Card',
            layoutOpen: true,
            itemLabel: 'Add element',
        },
    },
    objectSpec: {
        defaultValue: {
            name: 'value',
            age: 10,
            license: false,
        },
        type: SpecTypes.Object,
        properties: {
            name: {
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'Name',
                },
            },
            age: {
                type: SpecTypes.Number,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'Age',
                },
            },
            license: {
                type: SpecTypes.Boolean,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'License',
                },
            },
        },
        viewSpec: {
            type: 'base',
            layout: 'card_accordeon',
            layoutTitle: 'Candidate',
            layoutOpen: true,
        },
    },
};

export const SECTION_CARD: Record<string, ArraySpec | ObjectSpec> = {
    arraySpec: {
        defaultValue: ['value'],
        type: SpecTypes.Array,
        items: {
            type: SpecTypes.String,
            viewSpec: {
                type: 'base',
                layout: 'row',
                layoutTitle: 'Element',
            },
        },
        viewSpec: {
            type: 'base',
            layout: 'card_section',
            layoutTitle: 'Accordeon Card',
            layoutOpen: true,
            itemLabel: 'Add element',
        },
    },
    objectSpec: {
        defaultValue: {
            name: 'value',
            age: 10,
            license: false,
        },
        type: SpecTypes.Object,
        properties: {
            name: {
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'Name',
                },
            },
            age: {
                type: SpecTypes.Number,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'Age',
                },
            },
            license: {
                type: SpecTypes.Boolean,
                viewSpec: {
                    type: 'base',
                    layout: 'row',
                    layoutTitle: 'License',
                },
            },
        },
        viewSpec: {
            type: 'base',
            layout: 'card_section',
            layoutTitle: 'Candidate',
            layoutOpen: true,
        },
    },
};

export const VALUE: Record<string, FormValue> = {
    array: ['value', 'value'],
    object: {
        name: 'name',
        age: 21,
        license: true,
    },
};
