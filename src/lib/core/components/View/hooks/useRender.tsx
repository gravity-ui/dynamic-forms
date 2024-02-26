import React from 'react';

import get from 'lodash/get';
import isString from 'lodash/isString';
import {isValidElementType} from 'react-is';

import {isCorrectSpec} from '../../../helpers';
import {FormValue, Spec} from '../../../types';
import {IndependentViewEntity, ViewEntity, ViewLayoutType} from '../types';

export interface UseRenderParams<Value extends FormValue, SpecType extends Spec> {
    value: Value;
    name: string;
    spec: SpecType;
    viewEntity?: ViewEntity<Value, SpecType> | IndependentViewEntity<Value, SpecType>;
    Layout?: ViewLayoutType<Value, SpecType>;
    Link?: React.ComponentType<{value: Value; link: SpecType['viewSpec']['link']}>;
}

export const useRender = <Value extends FormValue, SpecType extends Spec>({
    value,
    name,
    spec,
    viewEntity,
    Layout,
    Link,
}: UseRenderParams<Value, SpecType>) => {
    const render = React.useMemo(() => {
        if (viewEntity && isCorrectSpec(spec) && isString(name)) {
            if (!spec.viewSpec.hidden) {
                const currentValue = name ? get(value, name) : value;
                const linkValue =
                    isValidElementType(Link) && spec?.viewSpec?.link ? (
                        <Link value={currentValue} link={spec.viewSpec.link} />
                    ) : undefined;

                if (viewEntity.independent) {
                    const InputComponent = viewEntity.Component;

                    return (
                        <InputComponent
                            spec={spec}
                            name={name}
                            Layout={Layout}
                            value={currentValue}
                            linkValue={linkValue}
                        />
                    );
                }

                const InputComponent = viewEntity.Component;
                const input = (
                    <InputComponent
                        spec={spec}
                        name={name}
                        value={currentValue}
                        linkValue={linkValue}
                    />
                );

                if (Layout) {
                    return (
                        <Layout spec={spec} name={name} value={currentValue}>
                            {input}
                        </Layout>
                    );
                }

                return input;
            }
        }

        return null;
    }, [spec, name, value, viewEntity, Layout, Link]);

    return render;
};
