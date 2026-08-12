import React from 'react';

import {render, screen} from '@testing-library/react';

import type {DynamicViewConfig, ObjectIndependentView} from '../';
import {DynamicView, ViewController} from '../';
import {dynamicViewConfig} from '../../../../kit';
import {SpecTypes} from '../../../constants';
import type {ObjectSpec} from '../../../types';

const stringSpec = {type: SpecTypes.String, viewSpec: {type: 'base', layout: ''}} as const;

const spec: ObjectSpec = {
    type: SpecTypes.Object,
    properties: {
        'agent.cluster': stringSpec,
        'agent.auth.serviceAccountId': stringSpec,
        namespace: stringSpec,
        'agent.namespaces': {
            type: SpecTypes.Array,
            items: stringSpec,
            viewSpec: {type: 'base', layout: ''},
        },
        'agent.resources': {
            type: SpecTypes.Object,
            properties: {cpu: stringSpec, 'limits.memory': stringSpec},
            viewSpec: {type: 'base', layout: ''},
        },
        applicationName: stringSpec,
    },
    viewSpec: {type: 'base', layout: ''},
};

const value = {
    'agent.cluster': 'main-cluster',
    'agent.auth.serviceAccountId': 'service-account-1',
    namespace: 'default-namespace',
    'agent.namespaces': ['namespace-one', 'namespace-two', 'namespace-three'],
    'agent.resources': {cpu: 'cpu-limit-2', 'limits.memory': 'memory-limit-4'},
    applicationName: 'log-agent',
};

describe('View/DynamicView', () => {
    test('renders values of properties with dots in keys', () => {
        render(<DynamicView value={value} spec={spec} config={dynamicViewConfig} />);

        expect(screen.getByText('main-cluster')).toBeInTheDocument();
        expect(screen.getByText('service-account-1')).toBeInTheDocument();
        expect(screen.getByText('default-namespace')).toBeInTheDocument();
        expect(screen.getByText('namespace-one')).toBeInTheDocument();
        expect(screen.getByText('namespace-two')).toBeInTheDocument();
        expect(screen.getByText('namespace-three')).toBeInTheDocument();
        expect(screen.getByText('cpu-limit-2')).toBeInTheDocument();
        expect(screen.getByText('memory-limit-4')).toBeInTheDocument();
        expect(screen.getByText('log-agent')).toBeInTheDocument();
    });

    test('reads the value by name for views that do not pass resolvedValue', () => {
        const LegacyObjectView: ObjectIndependentView = ({spec, name}) => (
            <React.Fragment>
                {Object.keys(spec.properties || {}).map((property) => (
                    <ViewController
                        key={property}
                        spec={spec.properties![property]}
                        name={`${name ? name + '.' : ''}${property}`}
                    />
                ))}
            </React.Fragment>
        );

        const legacyConfig: DynamicViewConfig = {
            ...dynamicViewConfig,
            object: {
                ...dynamicViewConfig.object,
                views: {
                    ...dynamicViewConfig.object.views,
                    base: {Component: LegacyObjectView, independent: true},
                },
            },
        };

        const legacySpec: ObjectSpec = {
            type: SpecTypes.Object,
            properties: {
                agent: {
                    type: SpecTypes.Object,
                    properties: {cluster: stringSpec},
                    viewSpec: {type: 'base', layout: ''},
                },
            },
            viewSpec: {type: 'base', layout: ''},
        };

        render(
            <DynamicView
                value={{agent: {cluster: 'legacy-cluster'}}}
                spec={legacySpec}
                config={legacyConfig}
            />,
        );

        expect(screen.getByText('legacy-cluster')).toBeInTheDocument();
    });
});
