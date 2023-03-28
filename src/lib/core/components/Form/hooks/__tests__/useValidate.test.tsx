import React from 'react';

import {render} from '@testing-library/react';
import _ from 'lodash';
import {Form} from 'react-final-form';

import {ValidatorType} from '../../../../../core';
import {dynamicConfig} from '../../../../../kit';
import {SpecTypes} from '../../../../constants';
import {StringSpec} from '../../../../types';
import {DynamicField} from '../../DynamicField';
import {WonderMirror} from '../../types';

const spec: StringSpec = {type: SpecTypes.String, viewSpec: {type: ''}};
const value = {name: 'value'};
const name = 'name';

describe('Form/hooks/useValidate', () => {
    test('incorrect config', () => {
        const mirror: WonderMirror = {field: {}, controller: {}};

        render(
            <Form initialValues={value} onSubmit={_.noop}>
                {() => (
                    <DynamicField name={name} spec={spec} config={{} as any} __mirror={mirror} />
                )}
            </Form>,
        );

        expect(mirror.controller[name]?.useValidate).toBe(undefined);
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

        expect(mirror.controller[name]?.useValidate).toBe(undefined);
    });

    test('empty base validator', () => {
        const mirror: WonderMirror = {field: {}, controller: {}};
        const _config = _.cloneDeep(dynamicConfig);

        _config.string.validators.base = undefined as unknown as ValidatorType<string, StringSpec>;

        render(
            <Form initialValues={value} onSubmit={_.noop}>
                {() => <DynamicField name={name} spec={spec} config={_config} __mirror={mirror} />}
            </Form>,
        );

        expect(mirror.controller[name]?.useValidate).toBe(undefined);
    });

    test('empty spec.validator', () => {
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

        expect(mirror.controller[name]?.useValidate?.(' q')).toBe(
            dynamicConfig.string.validators.base(spec, ' q'),
        );
        expect(mirror.controller[name]?.useValidate?.('q ')).toBe(
            dynamicConfig.string.validators.base(spec, 'q '),
        );
    });

    test('spec.validator not found', () => {
        const mirror: WonderMirror = {field: {}, controller: {}};
        const _spec = _.cloneDeep(spec);

        _spec.validator = 'nonexistent';

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

        expect(mirror.controller[name]?.useValidate).toBe(undefined);
    });

    test('spec.validator found', () => {
        const mirror: WonderMirror = {field: {}, controller: {}};
        const _spec = _.cloneDeep(spec);

        _spec.validator = 'number';

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

        expect(mirror.controller[name]?.useValidate?.('.0')).toBe(
            dynamicConfig.string.validators.number?.(spec, '.0'),
        );
        expect(mirror.controller[name]?.useValidate?.('1.')).toBe(
            dynamicConfig.string.validators.number?.(spec, '1.'),
        );
    });
});
