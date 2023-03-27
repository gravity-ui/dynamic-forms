import React from 'react';

import {render} from '@testing-library/react';
import _ from 'lodash';
import {Form} from 'react-final-form';

import {ObjectBase, Row, Text, dynamicConfig} from '../../../../../kit';
import {SpecTypes} from '../../../../constants';
import {ObjectSpec, StringSpec} from '../../../../types';
import {DynamicField} from '../../DynamicField';
import {WonderMirror} from '../../types';

const spec: StringSpec = {type: SpecTypes.String, viewSpec: {type: 'base', layout: 'row'}};
const value = {name: {key: 'value'}};
const name = 'name';

describe('Form/hooks/useRender', () => {
    test('incorrect name', () => {
        const mirror: WonderMirror = {field: {}, controller: {}};

        render(
            <Form initialValues={value} onSubmit={_.noop}>
                {() => (
                    <DynamicField
                        name={undefined as any}
                        spec={spec}
                        config={dynamicConfig}
                        __mirror={mirror}
                    />
                )}
            </Form>,
        );

        expect(mirror.controller[name]?.useRender).toBe(undefined);
    });

    test('incorrect spec', () => {
        const mirror: WonderMirror = {field: {}, controller: {}};

        render(
            <Form initialValues={value} onSubmit={_.noop}>
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

        expect(mirror.controller[name]?.useRender).toBe(undefined);
    });

    test('empty inputEntity', () => {
        const mirror: WonderMirror = {field: {}, controller: {}};
        const _spec = _.cloneDeep(spec);

        _spec.viewSpec.type = 'nonexistent';

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

        expect(mirror.controller[name]?.useRender).toBeInstanceOf(Function);
        expect(mirror.controller[name]?.useRender!(mirror.controller[name]?.useField!)).toBe(null);
    });

    test('independent inputEntity', () => {
        const mirror: WonderMirror = {field: {}, controller: {}};
        const _spec: ObjectSpec = {type: SpecTypes.Object, viewSpec: {type: 'base', layout: 'row'}};

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

        expect(mirror.controller[name]?.useRender).toBeInstanceOf(Function);

        const result = mirror.controller[name]?.useRender!(mirror.controller[name]?.useField!);

        expect(result?.type).toBe(ObjectBase);
        expect(result?.props.Layout).toBe(Row);
    });

    test('independent inputEntity without Layout', () => {
        const mirror: WonderMirror = {field: {}, controller: {}};
        const _spec: ObjectSpec = {type: SpecTypes.Object, viewSpec: {type: 'base'}};

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

        expect(mirror.controller[name]?.useRender).toBeInstanceOf(Function);

        const result = mirror.controller[name]?.useRender!(mirror.controller[name]?.useField!);

        expect(result?.type).toBe(ObjectBase);
        expect(result?.props.Layout).toBe(undefined);
    });

    test('inputEntity wrapped by Layout', () => {
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

        expect(mirror.controller[name]?.useRender).toBeInstanceOf(Function);

        const result = mirror.controller[name]?.useRender!(mirror.controller[name]?.useField!);

        expect(result?.type).toBe(Row);
        expect(result?.props.children.type).toBe(Text);
    });

    test('inputEntity without Layout', () => {
        const mirror: WonderMirror = {field: {}, controller: {}};
        const _spec = _.cloneDeep(spec);

        _spec.viewSpec.layout = 'nonexistent';

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

        expect(mirror.controller[name]?.useRender).toBeInstanceOf(Function);

        const result = mirror.controller[name]?.useRender!(mirror.controller[name]?.useField!);

        expect(result?.type).toBe(Text);
        expect(result?.props.Layout).toBe(undefined);
    });
});
