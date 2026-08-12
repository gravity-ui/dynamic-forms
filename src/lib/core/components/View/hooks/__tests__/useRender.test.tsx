import React from 'react';

import {render} from '@testing-library/react';
import cloneDeep from 'lodash/cloneDeep';

import type {UseRenderParams} from '../';
import {useComponents, useRender} from '../';
import type {FormValue, Spec} from '../../../../../core';
import {BaseView, ObjectBaseView, ViewRow, dynamicViewConfig} from '../../../../../kit';
import {SpecTypes} from '../../../../constants';
import type {ObjectSpec, StringSpec} from '../../../../types';
import type {DynamicViewConfig} from '../../types';

const name = 'name';
const value = {name: 'value'};
const spec: StringSpec = {type: SpecTypes.String, viewSpec: {type: '', layout: ''}};

interface UseRenderProps {
    mirror: {
        useRender?: ReturnType<typeof useRender>;
    };
    name: string;
    value: FormValue;
    resolved?: boolean;
    spec: Spec;
    config: DynamicViewConfig;
    Link?: React.ComponentType<{
        value: FormValue;
        link: Spec['viewSpec']['link'];
    }>;
}

const UseRender: React.FC<UseRenderProps> = ({mirror, spec, config, ...rest}) => {
    const {viewEntity, Layout} = useComponents(spec, config);

    mirror.useRender = useRender({spec, viewEntity, Layout, ...rest} as UseRenderParams<
        FormValue,
        Spec
    >);

    return null;
};

describe('View/hooks/useRender', () => {
    test('incorrect spec', () => {
        const mirror: UseRenderProps['mirror'] = {};

        render(
            <UseRender
                mirror={mirror}
                name={name}
                value={value}
                spec={{} as any}
                config={dynamicViewConfig}
            />,
        );

        expect(mirror.useRender).toBe(null);
    });

    test('incorrect name', () => {
        const mirror: UseRenderProps['mirror'] = {};
        const _spec = cloneDeep(spec);

        _spec.viewSpec.type = 'base';

        render(
            <UseRender
                mirror={mirror}
                name={undefined as any}
                value={value}
                spec={_spec}
                config={dynamicViewConfig}
            />,
        );

        expect(mirror.useRender).toBe(null);
    });

    test('empty viewEntity', () => {
        const mirror: UseRenderProps['mirror'] = {};

        render(
            <UseRender
                mirror={mirror}
                name={name}
                value={value}
                spec={spec}
                config={dynamicViewConfig}
            />,
        );

        expect(mirror.useRender).toBe(null);
    });

    test('independent viewEntity and Layout found', () => {
        const mirror: UseRenderProps['mirror'] = {};
        const _spec: ObjectSpec = {type: SpecTypes.Object, viewSpec: {type: 'base', layout: 'row'}};

        render(
            <UseRender
                mirror={mirror}
                name={name}
                value={value}
                spec={_spec}
                config={dynamicViewConfig}
            />,
        );
        expect(mirror.useRender?.type).toBe(ObjectBaseView);
        expect(mirror.useRender?.props.Layout).toBe(ViewRow);
    });

    test('viewEntity and Layout found', () => {
        const mirror: UseRenderProps['mirror'] = {};
        const _spec = cloneDeep(spec);

        _spec.viewSpec.type = 'base';
        _spec.viewSpec.layout = 'row';

        render(
            <UseRender
                mirror={mirror}
                name={name}
                value={value}
                spec={_spec}
                config={dynamicViewConfig}
            />,
        );
        expect(mirror.useRender?.type).toBe(ViewRow);
        expect(mirror.useRender?.props.children.type).toBe(BaseView);
    });

    test('viewEntity found', () => {
        const mirror: UseRenderProps['mirror'] = {};
        const _spec = cloneDeep(spec);

        _spec.viewSpec.type = 'base';

        render(
            <UseRender
                mirror={mirror}
                name={name}
                value={value}
                spec={_spec}
                config={dynamicViewConfig}
            />,
        );
        expect(mirror.useRender?.type).toBe(BaseView);
    });

    test('incorrect Link', () => {
        const mirror: UseRenderProps['mirror'] = {};
        const _spec = cloneDeep(spec);

        _spec.viewSpec.type = 'base';
        _spec.viewSpec.link = 'link';

        render(
            <UseRender
                mirror={mirror}
                name={name}
                value={value}
                spec={_spec}
                config={dynamicViewConfig}
                Link={null as any}
            />,
        );
        expect(mirror.useRender?.props.linkValue).toBe(undefined);
    });

    test('correct Link', () => {
        const mirror: UseRenderProps['mirror'] = {};
        const Link = () => null;
        const _spec = cloneDeep(spec);

        _spec.viewSpec.type = 'base';
        _spec.viewSpec.link = 'link';

        render(
            <UseRender
                mirror={mirror}
                name={name}
                value={value}
                spec={_spec}
                config={dynamicViewConfig}
                Link={Link}
            />,
        );

        expect(mirror.useRender?.props.linkValue.type).toBe(Link);
        expect(mirror.useRender?.props.linkValue.props.value).toBe(value[name]);
        expect(mirror.useRender?.props.linkValue.props.link).toBe(_spec.viewSpec.link);
    });

    describe('resolved', () => {
        const baseSpec = (): StringSpec => {
            const _spec = cloneDeep(spec);

            _spec.viewSpec.type = 'base';

            return _spec;
        };

        test('reads value by name as a path when not resolved', () => {
            const mirror: UseRenderProps['mirror'] = {};

            render(
                <UseRender
                    mirror={mirror}
                    name="dotted.key"
                    value={{dotted: {key: 'nested'}}}
                    spec={baseSpec()}
                    config={dynamicViewConfig}
                />,
            );

            expect(mirror.useRender?.props.value).toBe('nested');
        });

        test('uses value as is when resolved', () => {
            const mirror: UseRenderProps['mirror'] = {};

            render(
                <UseRender
                    mirror={mirror}
                    name="dotted.key"
                    value="resolved"
                    resolved
                    spec={baseSpec()}
                    config={dynamicViewConfig}
                />,
            );

            expect(mirror.useRender?.props.value).toBe('resolved');
        });

        test('does not fall back to the path when resolved value is undefined', () => {
            const mirror: UseRenderProps['mirror'] = {};

            render(
                <UseRender
                    mirror={mirror}
                    name="dotted.key"
                    value={undefined}
                    resolved
                    spec={baseSpec()}
                    config={dynamicViewConfig}
                />,
            );

            expect(mirror.useRender?.props.value).toBe(undefined);
        });
    });
});
