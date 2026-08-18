import React from 'react';

import {render} from '@testing-library/react';

import {DynamicView} from '../';
import {dynamicViewConfig} from '../../../../kit';
import {SpecTypes} from '../../../constants';
import type {ObjectSpec} from '../../../types';

const stringSpec = {type: SpecTypes.String, viewSpec: {type: 'base', layout: ''}} as const;

describe('View/DynamicView', () => {
    beforeAll(() => {
        window.IntersectionObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
            takeRecords() {
                return [];
            }
        } as unknown as typeof IntersectionObserver;
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('warns about spec property keys containing dots', () => {
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

        const spec: ObjectSpec = {
            type: SpecTypes.Object,
            properties: {
                'agent.cluster': stringSpec,
                namespace: stringSpec,
                'agent.resources': {
                    type: SpecTypes.Object,
                    properties: {'limits.memory': stringSpec},
                    viewSpec: {type: 'base', layout: ''},
                },
                servers: {
                    type: SpecTypes.Array,
                    items: {
                        type: SpecTypes.Object,
                        properties: {'net.host': stringSpec},
                        viewSpec: {type: 'base', layout: ''},
                    },
                    viewSpec: {type: 'base', layout: ''},
                },
            },
            viewSpec: {type: 'base', layout: ''},
        };

        render(<DynamicView value={{}} spec={spec} config={dynamicViewConfig} />);

        expect(warn).toHaveBeenCalledTimes(1);

        const message = warn.mock.calls[0][0] as string;

        ['agent.cluster', 'agent.resources', 'limits.memory', 'net.host'].forEach((key) => {
            expect(message).toContain(key);
        });
        expect(message).not.toContain('namespace,');
    });

    test('does not warn when spec property keys have no dots', () => {
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

        const spec: ObjectSpec = {
            type: SpecTypes.Object,
            properties: {namespace: stringSpec},
            viewSpec: {type: 'base', layout: ''},
        };

        render(<DynamicView value={{namespace: 'main'}} spec={spec} config={dynamicViewConfig} />);

        expect(warn).not.toHaveBeenCalled();
    });
});
