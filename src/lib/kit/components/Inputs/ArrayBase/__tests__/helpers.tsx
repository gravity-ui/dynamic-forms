import React from 'react';

import {DynamicForm as BaseDynamicForm} from '~playwright/core/DynamicForm';

import type {ArraySpec, FormValue, Spec} from '../../../../../core';
import {SpecTypes} from '../../../../../core';

export const ARRAY_BASE: Record<string, ArraySpec> = {
    default: {
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
            layout: 'accordeon',
            layoutTitle: 'Elements',
            layoutOpen: true,
            itemLabel: 'Add element',
        },
    },
    defaultValue: {
        defaultValue: ['foo', 'bar', 'rab', 'oof'],
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
            layout: 'accordeon',
            layoutTitle: 'Elements',
            layoutOpen: true,
            itemLabel: 'Add element',
        },
    },
    required: {
        required: true,
        defaultValue: ['foo', 'bar', 'rab', 'oof'],
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
            layout: 'accordeon',
            layoutTitle: 'Elements',
            layoutOpen: true,
            itemLabel: 'Add element',
        },
    },
    errorMaxLength: {
        maxLength: BigInt(4),
        defaultValue: ['foo', 'bar', 'rab', 'oof'],
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
            layout: 'accordeon',
            layoutTitle: 'Elements',
            layoutOpen: true,
            itemLabel: 'Add element',
        },
    },
    errorMinLength: {
        minLength: BigInt(4),
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
            layout: 'accordeon',
            layoutTitle: 'Elements',
            layoutOpen: true,
            itemLabel: 'Add element',
        },
    },
    description: {
        defaultValue: ['foo', 'bar', 'rab', 'oof'],
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
            layout: 'accordeon',
            layoutTitle: 'Elements',
            layoutDescription: 'description',
            layoutOpen: true,
            itemLabel: 'Add element',
        },
    },
    itemPrefix: {
        defaultValue: ['foo', 'bar', 'rab', 'oof'],
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
            layout: 'accordeon',
            layoutTitle: 'Elements',
            layoutOpen: true,
            itemLabel: 'Add element',
            itemPrefix: 'Item prefix',
        },
    },
    addButtonPosition: {
        defaultValue: ['foo', 'bar', 'rab', 'oof'],
        type: SpecTypes.Array,
        items: {
            type: SpecTypes.String,
            viewSpec: {
                type: 'base',
                layout: 'transparent',
                layoutTitle: 'Element',
            },
        },
        viewSpec: {
            type: 'base',
            layout: 'row',
            layoutTitle: 'Elements',
            layoutOpen: true,
            itemPrefix: 'Item prefix',
            addButtonPosition: 'right',
        },
    },
};

export const VALUE: Record<string, FormValue> = {
    array: ['value', 'value'],
};

export const DynamicForm = ({spec}: {spec: Spec}) => {
    return (
        <div style={{width: 600}}>
            <BaseDynamicForm spec={spec} />
        </div>
    );
};
