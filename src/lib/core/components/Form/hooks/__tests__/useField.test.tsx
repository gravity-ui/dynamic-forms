import React from 'react';

import {act, render} from '@testing-library/react';
import _ from 'lodash';
import {Form} from 'react-final-form';

import {ErrorMessages, dynamicConfig} from '../../../../../kit';
import {SpecTypes} from '../../../../constants';
import {ArraySpec, ObjectSpec, StringSpec} from '../../../../types';
import {DynamicField} from '../../DynamicField';
import {OBJECT_ARRAY_CNT, OBJECT_ARRAY_FLAG} from '../../constants';
import {WonderMirror} from '../../types';

const spec: ObjectSpec = {type: SpecTypes.Object, viewSpec: {type: ''}};
const value = {name: {key: 'value'}};
const name = 'name';

describe('Form/hooks/useField', () => {
    test('initialization with initialValue', () => {
        const mirror: WonderMirror = {field: {}, controller: {}};

        render(
            <Form initialValues={value} onSubmit={_.noop}>
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

        expect(mirror.controller[name]?.useField?.input.value).not.toBe(value[name]);
        expect(mirror.controller[name]?.useField?.input.value).not.toBe(
            mirror.field.useStore?.store.values[name],
        );
        expect(mirror.controller[name]?.useField?.input.value).toMatchObject(value[name]);

        expect(mirror.controller[name]?.useField?.arrayInput.value).not.toBe(value[name]);
        expect(mirror.controller[name]?.useField?.arrayInput.value).not.toBe(
            mirror.field.useStore?.store.values[name],
        );
        expect(mirror.controller[name]?.useField?.arrayInput.value).toMatchObject(value[name]);

        expect(mirror.field.useStore?.store.values[name]).not.toBe(value[name]);
        expect(mirror.field.useStore?.store.values[name]).toMatchObject(value[name]);
        expect(mirror.field.useStore?.store.errors[name]).toBe(undefined);
    });

    test('initialization with initialValue from spec', () => {
        const mirror: WonderMirror = {field: {}, controller: {}};
        const _spec = _.cloneDeep(spec);

        _spec.defaultValue = value[name];

        render(
            <Form initialValues={{}} onSubmit={_.noop}>
                {() => (
                    <DynamicField
                        name={name}
                        spec={_spec}
                        config={dynamicConfig}
                        __mirror={mirror}
                    />
                )}
            </Form>,
        );

        expect(mirror.controller[name]?.useField?.input.value).not.toBe(value[name]);
        expect(mirror.controller[name]?.useField?.input.value).not.toBe(
            mirror.field.useStore?.store.values[name],
        );
        expect(mirror.controller[name]?.useField?.input.value).toMatchObject(value[name]);

        expect(mirror.controller[name]?.useField?.arrayInput.value).not.toBe(value[name]);
        expect(mirror.controller[name]?.useField?.arrayInput.value).not.toBe(
            mirror.field.useStore?.store.values[name],
        );
        expect(mirror.controller[name]?.useField?.arrayInput.value).toMatchObject(value[name]);

        expect(mirror.field.useStore?.store.values[name]).not.toBe(value[name]);
        expect(mirror.field.useStore?.store.values[name]).toMatchObject(value[name]);
        expect(mirror.field.useStore?.store.errors[name]).toBe(undefined);
    });

    test('initialization with required object spec', () => {
        const mirror: WonderMirror = {field: {}, controller: {}};
        const _spec = _.cloneDeep(spec);

        _spec.required = true;

        render(
            <Form initialValues={{}} onSubmit={_.noop}>
                {() => (
                    <DynamicField
                        name={name}
                        spec={_spec}
                        config={dynamicConfig}
                        __mirror={mirror}
                    />
                )}
            </Form>,
        );

        const objectDefault = {};

        expect(mirror.controller[name]?.useField?.input.value).not.toBe(
            mirror.field.useStore?.store.values[name],
        );
        expect(mirror.controller[name]?.useField?.input.value).toMatchObject(objectDefault);

        expect(mirror.controller[name]?.useField?.arrayInput.value).not.toBe(
            mirror.field.useStore?.store.values[name],
        );
        expect(mirror.controller[name]?.useField?.arrayInput.value).toMatchObject(objectDefault);

        expect(mirror.field.useStore?.store.values[name]).toMatchObject(objectDefault);
        expect(mirror.field.useStore?.store.errors[name]).toBe(undefined);
    });

    test('initialization with required array spec', () => {
        const mirror: WonderMirror = {field: {}, controller: {}};
        const _spec: ArraySpec = {type: SpecTypes.Array, viewSpec: {type: ''}};

        _spec.required = true;

        render(
            <Form initialValues={{}} onSubmit={_.noop}>
                {() => (
                    <DynamicField
                        name={name}
                        spec={_spec}
                        config={dynamicConfig}
                        __mirror={mirror}
                    />
                )}
            </Form>,
        );

        const arrayDefault = {[OBJECT_ARRAY_FLAG]: true, [OBJECT_ARRAY_CNT]: 0};

        expect(mirror.controller[name]?.useField?.input.value).not.toBe(
            mirror.field.useStore?.store.values[name],
        );
        expect(mirror.controller[name]?.useField?.input.value).toMatchObject(arrayDefault);

        expect(mirror.controller[name]?.useField?.arrayInput.value).not.toBe(
            mirror.field.useStore?.store.values[name],
        );
        expect(mirror.controller[name]?.useField?.arrayInput.value).toMatchObject(arrayDefault);

        expect(mirror.field.useStore?.store.values[name]).toMatchObject(arrayDefault);
        expect(mirror.field.useStore?.store.errors[name]).toBe(undefined);
    });

    test('initialization with error', () => {
        const mirror: WonderMirror = {field: {}, controller: {}};
        const _spec: StringSpec = {
            required: true,
            type: SpecTypes.String,
            viewSpec: {type: 'base', layout: 'row'},
        };

        render(
            <Form initialValues={{}} onSubmit={_.noop}>
                {() => (
                    <DynamicField
                        name={name}
                        spec={_spec}
                        config={dynamicConfig}
                        __mirror={mirror}
                    />
                )}
            </Form>,
        );

        expect(mirror.field.useStore?.store.errors[name]).toBe(ErrorMessages.REQUIRED);
    });

    test('onFocus/onBlur', () => {
        const mirror: WonderMirror = {field: {}, controller: {}};

        render(
            <Form initialValues={value} onSubmit={_.noop}>
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

        act(() => {
            mirror.controller[name]?.useField?.input.onFocus();
        });

        expect(mirror.controller[name]?.useField?.meta.active).toBe(true);
        expect(mirror.controller[name]?.useField?.meta.visited).toBe(true);

        act(() => {
            mirror.controller[name]?.useField?.input.onBlur();
        });

        expect(mirror.controller[name]?.useField?.meta.active).toBe(false);
        expect(mirror.controller[name]?.useField?.meta.touched).toBe(true);
    });

    test('onChange', () => {
        const mirror: WonderMirror = {field: {}, controller: {}};
        const _spec = _.cloneDeep(spec);

        _spec.required = true;

        render(
            <Form initialValues={value} onSubmit={_.noop}>
                {() => (
                    <DynamicField
                        name={name}
                        spec={_spec}
                        config={dynamicConfig}
                        __mirror={mirror}
                    />
                )}
            </Form>,
        );

        const nextValue = {key: 'test test'};

        act(() => {
            mirror.controller[name]?.useField?.input.onChange(nextValue, {
                [`${name}.key`]: 'too long',
            });
        });

        expect(mirror.controller[name]?.useField?.input.value).not.toBe(nextValue);
        expect(mirror.controller[name]?.useField?.input.value).not.toBe(
            mirror.field.useStore?.store.values[name],
        );
        expect(mirror.controller[name]?.useField?.input.value).toMatchObject(nextValue);

        expect(mirror.controller[name]?.useField?.arrayInput.value).not.toBe(nextValue);
        expect(mirror.controller[name]?.useField?.arrayInput.value).not.toBe(
            mirror.field.useStore?.store.values[name],
        );
        expect(mirror.controller[name]?.useField?.arrayInput.value).toMatchObject(nextValue);

        expect(mirror.field.useStore?.store.values[name]).not.toBe(nextValue);
        expect(mirror.field.useStore?.store.values[name]).toMatchObject(nextValue);
        expect(mirror.field.useStore?.store.errors).toMatchObject({
            [name]: undefined,
            [`${name}.key`]: 'too long',
        });

        expect(mirror.controller[name]?.useField?.meta.dirty).toBe(true);
        expect(mirror.controller[name]?.useField?.meta.error).toBe(undefined);
        expect(mirror.controller[name]?.useField?.meta.invalid).toBe(false);
        expect(mirror.controller[name]?.useField?.meta.modified).toBe(true);
        expect(mirror.controller[name]?.useField?.meta.touched).toBe(true);
        expect(mirror.controller[name]?.useField?.meta.valid).toBe(true);
        expect(mirror.controller[name]?.useField?.meta.visited).toBe(true);

        act(() => {
            mirror.controller[name]?.useField?.input.onChange(value[name], {
                [`${name}.key`]: false,
            });
        });

        expect(mirror.controller[name]?.useField?.input.value).not.toBe(value[name]);
        expect(mirror.controller[name]?.useField?.input.value).not.toBe(
            mirror.field.useStore?.store.values[name],
        );
        expect(mirror.controller[name]?.useField?.input.value).toMatchObject(value[name]);

        expect(mirror.controller[name]?.useField?.arrayInput.value).not.toBe(value[name]);
        expect(mirror.controller[name]?.useField?.arrayInput.value).not.toBe(
            mirror.field.useStore?.store.values[name],
        );
        expect(mirror.controller[name]?.useField?.arrayInput.value).toMatchObject(value[name]);

        expect(mirror.field.useStore?.store.values[name]).not.toBe(value[name]);
        expect(mirror.field.useStore?.store.values[name]).toMatchObject(value[name]);
        expect(mirror.field.useStore?.store.errors).toMatchObject({
            [name]: undefined,
            [`${name}.key`]: false,
        });

        expect(mirror.controller[name]?.useField?.meta.dirty).toBe(false);
        expect(mirror.controller[name]?.useField?.meta.error).toBe(undefined);
        expect(mirror.controller[name]?.useField?.meta.invalid).toBe(false);
        expect(mirror.controller[name]?.useField?.meta.modified).toBe(true);
        expect(mirror.controller[name]?.useField?.meta.touched).toBe(true);
        expect(mirror.controller[name]?.useField?.meta.valid).toBe(true);
        expect(mirror.controller[name]?.useField?.meta.visited).toBe(true);

        act(() => {
            mirror.controller[name]?.useField?.input.onChange(undefined, {
                [`${name}.key`]: false,
            });
        });

        expect(mirror.controller[name]?.useField?.input.value).toBe(undefined);
        expect(mirror.controller[name]?.useField?.arrayInput.value).toBe(undefined);
        expect(mirror.field.useStore?.store.values[name]).toBe(undefined);
        expect(mirror.field.useStore?.store.errors).toMatchObject({
            [name]: ErrorMessages.REQUIRED,
            [`${name}.key`]: false,
        });

        expect(mirror.controller[name]?.useField?.meta.dirty).toBe(true);
        expect(mirror.controller[name]?.useField?.meta.error).toBe(ErrorMessages.REQUIRED);
        expect(mirror.controller[name]?.useField?.meta.invalid).toBe(true);
        expect(mirror.controller[name]?.useField?.meta.modified).toBe(true);
        expect(mirror.controller[name]?.useField?.meta.touched).toBe(true);
        expect(mirror.controller[name]?.useField?.meta.valid).toBe(false);
        expect(mirror.controller[name]?.useField?.meta.visited).toBe(true);
    });

    test('onDrop', () => {
        const mirror: WonderMirror = {field: {}, controller: {}};

        render(
            <Form initialValues={value} onSubmit={_.noop}>
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

        act(() => {
            mirror.controller[name]?.useField?.input.onDrop();
        });

        expect(mirror.controller[name]?.useField?.input.value).toBe(undefined);
        expect(mirror.controller[name]?.useField?.arrayInput.value).toBe(undefined);
        expect(mirror.field.useStore?.store.values[name]).toBe(undefined);
        expect(mirror.field.useStore?.store.errors).toMatchObject({[name]: undefined});

        expect(mirror.controller[name]?.useField?.meta.dirty).toBe(true);
        expect(mirror.controller[name]?.useField?.meta.error).toBe(undefined);
        expect(mirror.controller[name]?.useField?.meta.invalid).toBe(false);
        expect(mirror.controller[name]?.useField?.meta.modified).toBe(true);
        expect(mirror.controller[name]?.useField?.meta.touched).toBe(true);
        expect(mirror.controller[name]?.useField?.meta.valid).toBe(true);
        expect(mirror.controller[name]?.useField?.meta.visited).toBe(true);
    });

    test('onDrop (array item)', () => {
        const mirror: WonderMirror = {field: {}, controller: {}};
        const _spec: ArraySpec = {
            type: SpecTypes.Array,
            items: {type: SpecTypes.String, viewSpec: {type: ''}},
            viewSpec: {type: 'base'},
        };
        const _value = {
            [name]: {
                '<0>': 'item',
                [OBJECT_ARRAY_FLAG]: true,
                [OBJECT_ARRAY_CNT]: 1,
            },
        };

        render(
            <Form initialValues={_value} onSubmit={_.noop}>
                {() => (
                    <DynamicField
                        name={name}
                        spec={_spec}
                        config={dynamicConfig}
                        __mirror={mirror}
                    />
                )}
            </Form>,
        );

        act(() => {
            mirror.controller[`${name}.<0>`]?.useField?.input.onDrop();
        });

        const nextValue = {
            [OBJECT_ARRAY_FLAG]: true,
            [OBJECT_ARRAY_CNT]: 1,
        };

        expect(mirror.controller[name]?.useField?.input.value).toMatchObject(nextValue);
        expect(mirror.controller[name]?.useField?.arrayInput.value).toMatchObject(nextValue);
        expect(mirror.field.useStore?.store.values[name]).toMatchObject(nextValue);

        expect(mirror.controller[`${name}.<0>`]).toBe(undefined);
    });

    test('onItemAdd/onItemRemove', () => {
        const mirror: WonderMirror = {field: {}, controller: {}};
        const _spec: ArraySpec = {type: SpecTypes.Array, viewSpec: {type: ''}};

        render(
            <Form initialValues={{}} onSubmit={_.noop}>
                {() => (
                    <DynamicField
                        name={name}
                        spec={_spec}
                        config={dynamicConfig}
                        __mirror={mirror}
                    />
                )}
            </Form>,
        );

        act(() => {
            mirror.controller[name]?.useField?.arrayInput.onItemAdd('item');
        });

        const nextValue = {
            '<0>': 'item',
            [OBJECT_ARRAY_FLAG]: true,
            [OBJECT_ARRAY_CNT]: 1,
        };

        expect(mirror.controller[name]?.useField?.input.value).not.toBe(nextValue);
        expect(mirror.controller[name]?.useField?.input.value).not.toBe(
            mirror.field.useStore?.store.values[name],
        );
        expect(mirror.controller[name]?.useField?.input.value).toMatchObject(nextValue);

        expect(mirror.controller[name]?.useField?.arrayInput.value).not.toBe(nextValue);
        expect(mirror.controller[name]?.useField?.arrayInput.value).not.toBe(
            mirror.field.useStore?.store.values[name],
        );
        expect(mirror.controller[name]?.useField?.arrayInput.value).toMatchObject(nextValue);

        expect(mirror.field.useStore?.store.values[name]).not.toBe(nextValue);
        expect(mirror.field.useStore?.store.values[name]).toMatchObject(nextValue);
        expect(mirror.field.useStore?.store.errors[name]).toBe(false);

        expect(mirror.controller[name]?.useField?.meta.dirty).toBe(true);
        expect(mirror.controller[name]?.useField?.meta.error).toBe(false);
        expect(mirror.controller[name]?.useField?.meta.invalid).toBe(false);
        expect(mirror.controller[name]?.useField?.meta.modified).toBe(true);
        expect(mirror.controller[name]?.useField?.meta.touched).toBe(true);
        expect(mirror.controller[name]?.useField?.meta.valid).toBe(true);
        expect(mirror.controller[name]?.useField?.meta.visited).toBe(true);

        act(() => {
            mirror.controller[name]?.useField?.arrayInput.onItemAdd();
        });

        const nextValue1 = {
            ...nextValue,
            '<1>': undefined,
            [OBJECT_ARRAY_CNT]: 2,
        };

        expect(mirror.controller[name]?.useField?.input.value).toMatchObject(nextValue1);
        expect(mirror.controller[name]?.useField?.arrayInput.value).toMatchObject(nextValue1);
        expect(mirror.field.useStore?.store.values[name]).toMatchObject(nextValue1);

        act(() => {
            mirror.controller[name]?.useField?.arrayInput.onItemRemove('0');
        });

        const nextValue2 = {
            '<1>': undefined,
            [OBJECT_ARRAY_FLAG]: true,
            [OBJECT_ARRAY_CNT]: 2,
        };

        expect(mirror.controller[name]?.useField?.input.value).toMatchObject(nextValue2);
        expect(mirror.controller[name]?.useField?.arrayInput.value).toMatchObject(nextValue2);
        expect(mirror.field.useStore?.store.values[name]).toMatchObject(nextValue2);
    });

    test('unmount', () => {
        const mirror: WonderMirror = {field: {}, controller: {}};
        const _spec = _.cloneDeep(spec);

        _spec.required = true;

        const {rerender} = render(
            <Form initialValues={{}} onSubmit={_.noop}>
                {() => (
                    <DynamicField
                        name={name}
                        spec={_spec}
                        config={dynamicConfig}
                        __mirror={mirror}
                    />
                )}
            </Form>,
        );

        expect(mirror.field.useStore?.store.values[name]).toMatchObject({});
        expect(mirror.field.useStore?.store.errors[name]).toBe(undefined);

        rerender(
            <Form initialValues={{}} onSubmit={_.noop}>
                {() => (
                    <DynamicField
                        name={name}
                        spec={{} as any}
                        config={dynamicConfig}
                        __mirror={mirror}
                    />
                )}
            </Form>,
        );

        expect(mirror.field.useStore?.store.values[name]).toBe(undefined);
        expect(mirror.field.useStore?.store.errors[name]).toBe(undefined);
    });

    test('onItemAdd and onDrop from array item number spec', () => {
        const mirror: WonderMirror = {field: {}, controller: {}};
        const _spec: ArraySpec = {
            type: SpecTypes.Array,
            items: {
                type: SpecTypes.Number,
                viewSpec: {
                    type: 'base',
                },
            },
            viewSpec: {
                type: 'base',
            },
        };

        render(
            <Form initialValues={{}} onSubmit={_.noop}>
                {() => (
                    <DynamicField
                        name={name}
                        spec={_spec}
                        config={dynamicConfig}
                        __mirror={mirror}
                    />
                )}
            </Form>,
        );

        act(() => {
            mirror.controller[name]?.useField?.arrayInput.onItemAdd(123);
        });

        const nextValue = {
            '<0>': 123,
            [OBJECT_ARRAY_FLAG]: true,
            [OBJECT_ARRAY_CNT]: 1,
        };

        expect(mirror.controller[name]?.useField?.input.value).not.toBe(nextValue);
        expect(mirror.controller[name]?.useField?.input.value).not.toBe(
            mirror.field.useStore?.store.values[name],
        );
        expect(mirror.controller[name]?.useField?.input.value).toMatchObject(nextValue);

        expect(mirror.controller[name]?.useField?.arrayInput.value).not.toBe(nextValue);
        expect(mirror.controller[name]?.useField?.arrayInput.value).not.toBe(
            mirror.field.useStore?.store.values[name],
        );
        expect(mirror.controller[name]?.useField?.arrayInput.value).toMatchObject(nextValue);

        expect(mirror.field.useStore?.store.values[name]).not.toBe(nextValue);
        expect(mirror.field.useStore?.store.values[name]).toMatchObject(nextValue);
        expect(mirror.field.useStore?.store.errors[name]).toBe(false);

        expect(mirror.controller[name]?.useField?.meta.dirty).toBe(true);
        expect(mirror.controller[name]?.useField?.meta.error).toBe(false);
        expect(mirror.controller[name]?.useField?.meta.invalid).toBe(false);
        expect(mirror.controller[name]?.useField?.meta.modified).toBe(true);
        expect(mirror.controller[name]?.useField?.meta.touched).toBe(true);
        expect(mirror.controller[name]?.useField?.meta.valid).toBe(true);
        expect(mirror.controller[name]?.useField?.meta.visited).toBe(true);

        act(() => {
            mirror.controller[`${name}.<0>`]?.useField?.input.onDrop();
        });

        const nextValue1 = {
            '____arr-obj': true,
            '____arr-obj-cnt': 1,
        };

        expect(mirror.controller[name]?.useField?.arrayInput.value).toMatchObject(nextValue1);
        expect(mirror.field.useStore?.store.values[name]).toMatchObject(nextValue1);

        expect(mirror.field.useStore?.store.errors).toMatchObject({[name]: undefined});

        expect(mirror.controller[name]?.useField?.meta.dirty).toBe(true);
        expect(mirror.controller[name]?.useField?.meta.error).toBe(undefined);
        expect(mirror.controller[name]?.useField?.meta.invalid).toBe(false);
        expect(mirror.controller[name]?.useField?.meta.modified).toBe(true);
        expect(mirror.controller[name]?.useField?.meta.touched).toBe(true);
        expect(mirror.controller[name]?.useField?.meta.valid).toBe(true);
        expect(mirror.controller[name]?.useField?.meta.visited).toBe(true);
    });
});
