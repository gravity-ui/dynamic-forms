import React from 'react';

import {act, render} from '@testing-library/react';
import type {FormApi} from 'final-form';
import cloneDeep from 'lodash/cloneDeep';
import noop from 'lodash/noop';
import {Form, useForm} from 'react-final-form';

import {ErrorMessages, dynamicConfig} from '../../../../../kit';
import {SpecTypes} from '../../../../constants';
import type {ObjectSpec} from '../../../../types';
import {DynamicField} from '../../DynamicField';
import type {WonderMirror} from '../../types';

const spec: ObjectSpec = {type: SpecTypes.Object, viewSpec: {type: ''}};
const value = {name: {key: 'value'}};
const name = 'name';

jest.mock('lodash/debounce', () => (f: Function) => f);

describe('Form/hooks/useIntegrationFF', () => {
    test('values changed', () => {
        const mirror: WonderMirror = {field: {}, controller: {}};
        const _spec = cloneDeep(spec);
        let form = null as FormApi | null;

        _spec.defaultValue = value[name];

        render(
            <Form initialValues={{}} onSubmit={noop}>
                {() => {
                    const Caller = () => {
                        form = useForm();

                        return null;
                    };

                    return (
                        <React.Fragment>
                            <DynamicField
                                name={name}
                                spec={_spec}
                                config={dynamicConfig}
                                __mirror={mirror}
                            />
                            <Caller />
                        </React.Fragment>
                    );
                }}
            </Form>,
        );

        expect(mirror.field.useStore?.store.values[name]).not.toBe(value[name]);
        expect(mirror.field.useStore?.store.values[name]).toMatchObject(value[name]);
        expect(form?.getState().values[name]).toMatchObject(value[name]);

        act(() => {
            mirror.controller[name]?.useField?.input.onChange(undefined);
        });

        expect(mirror.field.useStore?.store.values[name]).toBe(undefined);
        expect(form?.getState().values[name]).toBe(undefined);
    });

    test('errors changed', () => {
        const mirror: WonderMirror = {field: {}, controller: {}};
        const _spec = cloneDeep(spec);
        let form = null as FormApi | null;

        _spec.required = true;

        render(
            <Form initialValues={value} onSubmit={noop}>
                {() => {
                    const Caller = () => {
                        form = useForm();

                        return null;
                    };

                    return (
                        <React.Fragment>
                            <DynamicField
                                name={name}
                                spec={_spec}
                                config={dynamicConfig}
                                __mirror={mirror}
                            />
                            <Caller />
                        </React.Fragment>
                    );
                }}
            </Form>,
        );

        expect(mirror.field.useStore?.store.errors[name]).toBe(undefined);
        expect(mirror.field.useIntegrationFF?.props.validate()).toBe(undefined);
        expect(form?.getState().errors?.[name]).toBe(undefined);

        act(() => {
            mirror.controller[name]?.useField?.input.onChange(undefined);
        });

        expect(mirror.field.useStore?.store.errors[name]).toBe(ErrorMessages.REQUIRED);
        expect(mirror.field.useIntegrationFF?.props.validate()).toBe(ErrorMessages.REQUIRED);
        expect(form?.getState().errors?.[name]).toBe(ErrorMessages.REQUIRED);

        act(() => {
            mirror.controller[name]?.useField?.input.onChange({});
        });

        expect(mirror.field.useStore?.store.errors[name]).toBe(undefined);
        expect(mirror.field.useIntegrationFF?.props.validate()).toBe(undefined);
        expect(form?.getState().errors?.[name]).toBe(undefined);
    });
});
