import React from 'react';

import {render} from '@testing-library/react';
import noop from 'lodash/noop';
import {Form} from 'react-final-form';

import {dynamicConfig} from '../../../../../kit';
import {SpecTypes} from '../../../../constants';
import type {ObjectSpec} from '../../../../types';
import {DynamicField} from '../../DynamicField';
import type {WonderMirror} from '../../types';

const spec: ObjectSpec = {
    type: SpecTypes.Object,
    properties: {
        name: {
            type: SpecTypes.String,
            viewSpec: {
                type: 'base',
                layoutTitle: 'Name',
            },
        },
        surname: {
            type: SpecTypes.String,
            viewSpec: {
                type: 'base',
                layoutTitle: 'Surname',
            },
        },
        username: {
            type: SpecTypes.String,
            viewSpec: {
                type: 'base',
                layoutTitle: 'Username',
            },
        },
    },
    viewSpec: {type: 'base', layoutTitle: 'User'},
};
const value = {name: {name: 'value'}};
const name = 'name';

describe('Form/hooks/useSearch', () => {
    test('update store value', () => {
        const mirror: WonderMirror = {field: {}, controller: {}};

        const {rerender} = render(
            <Form initialValues={value} onSubmit={noop}>
                {() => (
                    <DynamicField
                        name={name}
                        spec={spec}
                        config={dynamicConfig}
                        search="user"
                        __mirror={mirror}
                    />
                )}
            </Form>,
        );

        expect(mirror.field.useSearchStore?.store).toMatchObject({
            name: false,
            'name.name': true,
            'name.surname': true,
            'name.username': false,
        });
        expect(mirror.controller['name.surname']?.useSearch?.(null)).toBe(null);

        rerender(
            <Form initialValues={value} onSubmit={noop}>
                {() => (
                    <DynamicField
                        name={name}
                        spec={spec}
                        config={dynamicConfig}
                        search="username"
                        __mirror={mirror}
                    />
                )}
            </Form>,
        );

        expect(mirror.field.useSearchStore?.store).toMatchObject({
            name: true,
            'name.name': true,
            'name.surname': true,
            'name.username': false,
        });
        expect(mirror.controller['name.surname']?.useSearch?.(null)).toBe(null);
    });
});
