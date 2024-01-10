import {ObjectSpec, SpecTypes} from '../../../../../core';

export const SECRET: Record<string, ObjectSpec> = {
    default: {
        type: SpecTypes.Object,
        properties: {
            raw: {
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                },
            },
        },
        viewSpec: {
            type: 'secret',
            layout: 'row',
            layoutTitle: 'Secret',
        },
    },
    full: {
        defaultValue: {raw: 'value'},
        type: SpecTypes.Object,
        properties: {
            raw: {
                type: SpecTypes.String,
                viewSpec: {
                    type: 'base',
                },
            },
        },
        viewSpec: {
            type: 'secret',
            layout: 'row',
            layoutTitle: 'Secret',
            layoutDescription: 'description',
        },
        required: true,
    },
};
