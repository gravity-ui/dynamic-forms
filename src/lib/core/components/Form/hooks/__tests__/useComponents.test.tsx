import React from 'react';

import {render} from '@testing-library/react';
import _ from 'lodash';
import {Form} from 'react-final-form';

import {Row, Text, dynamicConfig} from '../../../../../kit';
import {SpecTypes} from '../../../../constants';
import {StringSpec} from '../../../../types';
import {DynamicField} from '../../DynamicField';
import {WonderMirror} from '../../types';

const spec: StringSpec = {type: SpecTypes.String, viewSpec: {type: ''}};
const value = {name: 'value'};
const name = 'name';

describe('Form/hooks/useComponents', () => {
    test('incorrect config', () => {
        const mirror: WonderMirror = {field: {}, controller: {}};

        render(
            <Form initialValues={value} onSubmit={_.noop}>
                {() => (
                    <DynamicField name={name} spec={spec} config={{} as any} __mirror={mirror} />
                )}
            </Form>,
        );

        expect(mirror.controller[name]?.useComponents).toBe(undefined);
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

        expect(mirror.controller[name]?.useComponents).toBe(undefined);
    });

    test('inputEntity and Layout not found', () => {
        const mirror: WonderMirror = {field: {}, controller: {}};
        const _spec = _.cloneDeep(spec);

        _spec.viewSpec.type = 'nonexistent';
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

        expect(mirror.controller[name]?.useComponents?.inputEntity).toBe(undefined);
        expect(mirror.controller[name]?.useComponents?.Layout).toBe(undefined);
    });

    test('inputEntity not found', () => {
        const mirror: WonderMirror = {field: {}, controller: {}};
        const _spec = _.cloneDeep(spec);

        _spec.viewSpec.type = 'nonexistent';
        _spec.viewSpec.layout = 'row';

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

        expect(mirror.controller[name]?.useComponents?.inputEntity).toBe(undefined);
        expect(mirror.controller[name]?.useComponents?.Layout).toBe(Row);
    });

    test('Layout not found', () => {
        const mirror: WonderMirror = {field: {}, controller: {}};
        const _spec = _.cloneDeep(spec);

        _spec.viewSpec.type = 'base';
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

        expect(mirror.controller[name]?.useComponents?.inputEntity?.Component).toBe(Text);
        expect(mirror.controller[name]?.useComponents?.Layout).toBe(undefined);
    });

    test('inputEntity and Layout found', () => {
        const mirror: WonderMirror = {field: {}, controller: {}};
        const _spec = _.cloneDeep(spec);

        _spec.viewSpec.type = 'base';
        _spec.viewSpec.layout = 'row';

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

        expect(mirror.controller[name]?.useComponents?.inputEntity?.Component).toBe(Text);
        expect(mirror.controller[name]?.useComponents?.Layout).toBe(Row);
    });
});
