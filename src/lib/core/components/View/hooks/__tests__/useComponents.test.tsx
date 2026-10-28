import React from 'react';

import {render} from '@testing-library/react';
import cloneDeep from 'lodash/cloneDeep';

import type {Spec} from '../../../../../core';
import {BaseView, ViewRow, dynamicViewConfig} from '../../../../../kit';
import {SpecTypes} from '../../../../constants';
import type {StringSpec} from '../../../../types';
import type {DynamicViewConfig} from '../../types';
import {useComponents} from '../useComponents';

const spec: StringSpec = {type: SpecTypes.String, viewSpec: {type: '', layout: ''}};

interface UseComponentsProps {
    mirror: {
        useComponents?: ReturnType<typeof useComponents>;
    };
    spec: Spec;
    config: DynamicViewConfig;
}

const UseComponents: React.FC<UseComponentsProps> = ({mirror, spec, config}) => {
    mirror.useComponents = useComponents(spec, config);

    return null;
};

describe('View/hooks/useComponents', () => {
    test('incorrect config', () => {
        const mirror: UseComponentsProps['mirror'] = {};

        render(<UseComponents mirror={mirror} spec={spec} config={{} as any} />);

        expect(mirror.useComponents).toBeInstanceOf(Object);
        expect(mirror.useComponents?.viewEntity).toBe(undefined);
        expect(mirror.useComponents?.Layout).toBe(undefined);
    });

    test('incorrect spec', () => {
        const mirror: UseComponentsProps['mirror'] = {};

        render(<UseComponents mirror={mirror} spec={{} as any} config={dynamicViewConfig} />);

        expect(mirror.useComponents).toBeInstanceOf(Object);
        expect(mirror.useComponents?.viewEntity).toBe(undefined);
        expect(mirror.useComponents?.Layout).toBe(undefined);
    });

    test('inputEntity and Layout not found', () => {
        const mirror: UseComponentsProps['mirror'] = {};
        const _spec = cloneDeep(spec);

        _spec.viewSpec.type = 'nonexistent';
        _spec.viewSpec.layout = 'nonexistent';

        render(<UseComponents mirror={mirror} spec={_spec} config={dynamicViewConfig} />);

        expect(mirror.useComponents).toBeInstanceOf(Object);
        expect(mirror.useComponents?.viewEntity).toBe(undefined);
        expect(mirror.useComponents?.Layout).toBe(undefined);
    });

    test('inputEntity not found', () => {
        const mirror: UseComponentsProps['mirror'] = {};
        const _spec = cloneDeep(spec);

        _spec.viewSpec.type = 'nonexistent';
        _spec.viewSpec.layout = 'row';

        render(<UseComponents mirror={mirror} spec={_spec} config={dynamicViewConfig} />);

        expect(mirror.useComponents?.viewEntity).toBe(undefined);
        expect(mirror.useComponents?.Layout).toBe(ViewRow);
    });

    test('Layout not found', () => {
        const mirror: UseComponentsProps['mirror'] = {};
        const _spec = cloneDeep(spec);

        _spec.viewSpec.type = 'base';
        _spec.viewSpec.layout = 'nonexistent';

        render(<UseComponents mirror={mirror} spec={_spec} config={dynamicViewConfig} />);

        expect(mirror.useComponents?.viewEntity?.Component).toBe(BaseView);
        expect(mirror.useComponents?.Layout).toBe(undefined);
    });

    test('inputEntity and Layout found', () => {
        const mirror: UseComponentsProps['mirror'] = {};
        const _spec = cloneDeep(spec);

        _spec.viewSpec.type = 'base';
        _spec.viewSpec.layout = 'row';

        render(<UseComponents mirror={mirror} spec={_spec} config={dynamicViewConfig} />);

        expect(mirror.useComponents?.viewEntity?.Component).toBe(BaseView);
        expect(mirror.useComponents?.Layout).toBe(ViewRow);
    });
});
