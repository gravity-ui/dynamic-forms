import React from 'react';

import {act, render} from '@testing-library/react';
import isObjectLike from 'lodash/isObjectLike';
import noop from 'lodash/noop';
import {Form} from 'react-final-form';

import {Spec} from '../../../../../core';
import {dynamicConfig} from '../../../../../kit';
import {SpecTypes} from '../../../../constants';
import {ObjectSpec} from '../../../../types';
import {DynamicField} from '../../DynamicField';
import {FieldValue, WonderMirror} from '../../types';

const spec: ObjectSpec = {
    type: SpecTypes.Object,
    properties: {
        name: {
            type: SpecTypes.String,
            viewSpec: {
                type: '',
                layoutTitle: 'Name',
            },
        },
        surname: {
            type: SpecTypes.String,
            viewSpec: {
                type: '',
                layoutTitle: 'Surname',
            },
        },
        username: {
            type: SpecTypes.String,
            viewSpec: {
                type: '',
                layoutTitle: 'Username',
            },
        },
    },
    viewSpec: {type: 'base', layoutTitle: 'User'},
};
const value = {name: {name: 'value'}};
const name = 'name';

describe('Form/hooks/useSearchStore', () => {
    test('empty search', () => {
        const mirror: WonderMirror = {field: {}, controller: {}};

        render(
            <Form initialValues={value} onSubmit={noop}>
                {() => (
                    <DynamicField
                        name={name}
                        spec={spec}
                        config={dynamicConfig}
                        __mirror={mirror}
                    />
                )}
            </Form>,
        );

        expect(mirror.field.useSearchStore?.store).toMatchObject({});
    });

    test('string search', () => {
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

        rerender(
            <Form initialValues={value} onSubmit={noop}>
                {() => (
                    <DynamicField
                        name={name}
                        spec={spec}
                        config={dynamicConfig}
                        search="name"
                        __mirror={mirror}
                    />
                )}
            </Form>,
        );

        expect(mirror.field.useSearchStore?.store).toMatchObject({
            name: true,
            'name.name': false,
            'name.surname': false,
            'name.username': false,
        });
    });

    test('function search', () => {
        const mirror: WonderMirror = {field: {}, controller: {}};
        const searchFunction = (__: any, value: FieldValue) => {
            if (isObjectLike(value)) {
                return false;
            }

            return Boolean(value);
        };

        const {rerender} = render(
            <Form initialValues={value} onSubmit={noop}>
                {() => (
                    <DynamicField
                        name={name}
                        spec={spec}
                        config={dynamicConfig}
                        search={searchFunction}
                        __mirror={mirror}
                    />
                )}
            </Form>,
        );

        expect(mirror.field.useSearchStore?.store).toMatchObject({
            name: true,
            'name.name': false,
            'name.surname': true,
            'name.username': true,
        });

        const searchFunction2 = (spec: Spec) => {
            return Boolean(spec.viewSpec.layoutTitle?.toLowerCase().includes('name'));
        };

        rerender(
            <Form initialValues={value} onSubmit={noop}>
                {() => (
                    <DynamicField
                        name={name}
                        spec={spec}
                        config={dynamicConfig}
                        search={searchFunction2}
                        __mirror={mirror}
                    />
                )}
            </Form>,
        );

        expect(mirror.field.useSearchStore?.store).toMatchObject({
            name: true,
            'name.name': false,
            'name.surname': false,
            'name.username': false,
        });
    });

    test('setField/removeField', () => {
        const mirror: WonderMirror = {field: {}, controller: {}};

        render(
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

        act(() => {
            mirror.field.useSearchStore?.setField('name.key', true);
        });

        expect(mirror.field.useSearchStore?.store).toMatchObject({
            name: false,
            'name.name': true,
            'name.surname': true,
            'name.username': false,
            'name.key': true,
        });

        act(() => {
            mirror.field.useSearchStore?.removeField('name');
        });

        expect(mirror.field.useSearchStore?.store).toMatchObject({});
    });

    test('isHiddeField', () => {
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
        expect(mirror.field.useSearchStore?.isHiddenField('name.name')).toBe(false);
        expect(mirror.field.useSearchStore?.isHiddenField('name.surname')).toBe(false);

        rerender(
            <Form initialValues={value} onSubmit={noop}>
                {() => (
                    <DynamicField
                        name={name}
                        spec={spec}
                        config={dynamicConfig}
                        search="name"
                        __mirror={mirror}
                    />
                )}
            </Form>,
        );

        expect(mirror.field.useSearchStore?.store).toMatchObject({
            name: true,
            'name.name': false,
            'name.surname': false,
            'name.username': false,
        });
        expect(mirror.field.useSearchStore?.isHiddenField('name')).toBe(false);
    });
});
