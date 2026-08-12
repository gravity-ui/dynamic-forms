import React from 'react';

import type {StoryFn} from '@storybook/react';

import type {ObjectSpec} from '../lib';
import {ObjectBase, SpecTypes} from '../lib';

import {InputPreview} from './components';

export default {
    title: 'Object/DottedKeys',
    component: ObjectBase,
};

const baseSpec: ObjectSpec = {
    type: SpecTypes.Object,
    properties: {
        'agent.cluster': {
            type: SpecTypes.String,
            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Agent cluster'},
        },
        'agent.auth.serviceAccountId': {
            type: SpecTypes.String,
            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Service account ID'},
        },
        namespace: {
            type: SpecTypes.String,
            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Namespace'},
        },
        'agent.namespaces': {
            type: SpecTypes.Array,
            items: {
                type: SpecTypes.String,
                viewSpec: {type: 'base', layout: 'row'},
            },
            viewSpec: {
                type: 'base',
                layout: 'accordeon',
                layoutTitle: 'Namespaces to collect logs from',
                layoutOpen: true,
            },
        },
        'agent.resources': {
            type: SpecTypes.Object,
            properties: {
                cpu: {
                    type: SpecTypes.String,
                    viewSpec: {type: 'base', layout: 'row', layoutTitle: 'CPU limit'},
                },
            },
            viewSpec: {
                type: 'base',
                layout: 'accordeon',
                layoutTitle: 'Resource limits',
                layoutOpen: true,
            },
        },
        applicationName: {
            type: SpecTypes.String,
            viewSpec: {type: 'base', layout: 'row', layoutTitle: 'Application name'},
        },
    },
    viewSpec: {
        type: 'base',
        layout: 'accordeon',
        layoutTitle: 'Helm values with dots in keys',
        layoutOpen: true,
    },
};

const value = {
    'agent.cluster': 'main-cluster',
    'agent.auth.serviceAccountId': 'service-account-1',
    namespace: 'default-namespace',
    'agent.namespaces': ['namespace-one', 'namespace-two', 'namespace-three'],
    'agent.resources': {cpu: 'cpu-limit-2'},
    applicationName: 'log-agent',
};

const excludeOptions = [
    'description',
    'viewSpec.type',
    'viewSpec.oneOfParams',
    'viewSpec.delimiter',
    'viewSpec.inputProps',
];

const template = (spec: ObjectSpec = baseSpec) => {
    const Template: StoryFn<typeof ObjectBase> = (__, {viewMode}) => (
        <InputPreview
            spec={spec}
            value={value}
            excludeOptions={excludeOptions}
            viewMode={viewMode}
        />
    );

    return Template;
};

export const DottedKeys = template();
