import React from 'react';

import {act, render} from '@testing-library/react';
import noop from 'lodash/noop';
import omit from 'lodash/omit';
import {Form} from 'react-final-form';

import {dynamicConfig} from '../../../../../kit';
import {SpecTypes} from '../../../../constants';
import {ObjectSpec} from '../../../../types';
import {DynamicField} from '../../DynamicField';
import {WonderMirror} from '../../types';

const spec: ObjectSpec = {type: SpecTypes.Object, viewSpec: {type: ''}};
const value = {name: {key: 'value'}};
const name = 'name';

jest.mock('lodash/debounce', () => (f: Function) => f);

describe('Form/hooks/useStore', () => {
    test('initialization', () => {
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

        expect(mirror.field.useStore?.store.values[name]).not.toBe(value[name]);
        expect(mirror.field.useStore?.store.values[name]).toMatchObject(value[name]);
    });

    test('reinitialization (incoming param name changed)', () => {
        const mirror: WonderMirror = {field: {}, controller: {}};

        const {rerender} = render(
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

        expect(mirror.field.useStore?.store.values[name]).not.toBe(value[name]);
        expect(mirror.field.useStore?.store.values[name]).toMatchObject(value[name]);

        const nextName = `${name}.key`;

        rerender(
            <Form initialValues={value} onSubmit={noop}>
                {() => (
                    <DynamicField
                        name={nextName}
                        spec={spec}
                        config={dynamicConfig}
                        __mirror={mirror}
                    />
                )}
            </Form>,
        );

        expect(mirror.field.useStore?.store.values[nextName]).not.toBe(value[name]);
        expect(mirror.field.useStore?.store.values[nextName]).toBe(value[name].key);
    });

    test('change and unmount', () => {
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

        const nextValue = {
            name: {
                array: {
                    '____arr-obj': true,
                    '____arr-obj-cnt': 3,
                    '<0>': 1,
                    '<1>': 2,
                    '<2>': 3,
                },
                boolean: true,
                number: 1,
                object: {
                    number: 2,
                    boolean: false,
                },
                string: 'string',
            },
        };

        const nextErrors = {
            [`${name}.array`]: 'max length 11',
            [`${name}.object.number`]: 'max 1',
            [`${name}.object.boolean`]: 'required',
        };

        act(() => {
            mirror.field.useStore?.tools.onChange(name, nextValue[name], nextErrors);
        });

        expect(mirror.field.useStore?.store.values[name]).not.toBe(value[name]);
        expect(mirror.field.useStore?.store.values[name]).not.toBe(nextValue[name]);
        expect(mirror.field.useStore?.store.values[name]).toMatchObject(nextValue[name]);
        expect(mirror.field.useStore?.store.errors).toMatchObject(nextErrors);

        const unmountName = `${name}.object`;

        act(() => {
            mirror.field.useStore?.tools.onUnmount(unmountName);
        });

        const nextValue1 = (omit(nextValue, unmountName) as typeof nextValue)[name];
        const nextErrors1 = omit(
            nextErrors,
            Object.keys(nextErrors).filter((key) => key.startsWith(unmountName)),
        );

        expect(mirror.field.useStore?.store.values[name]).toMatchObject(nextValue1);
        expect(mirror.field.useStore?.store.errors).toMatchObject(nextErrors1);
    });
});
