import React from 'react';

import isObjectLike from 'lodash/isObjectLike';

import {GroupIndent} from '../../';
import {
    ObjectIndependentView,
    ObjectIndependentViewProps,
    SpecTypes,
    ViewController,
    isBooleanOneOfValue,
} from '../../../../core';
import {block} from '../../../utils';
import {OBJECT_VALUE_PROPERTY_NAME} from '../../../constants/common';

import './BooleanOneOfView.scss';
import cloneDeep from 'lodash/cloneDeep';

const b = block('boolean-oneof-view');

export interface BooleanOneOfViewProps extends ObjectIndependentViewProps {
    withoutIndent?: boolean;
}

export const BooleanOneOfView: React.FC<BooleanOneOfViewProps> = (props) => {
    const {value = {}, spec, Layout, name, withoutIndent} = props;

    const specProperties = React.useMemo(
        () => (isObjectLike(spec.properties) ? spec.properties! : {}),
        [spec.properties],
    );

    const toggler = React.useMemo(() => {
        const valueSpec = specProperties[OBJECT_VALUE_PROPERTY_NAME];

        if (!(valueSpec && valueSpec.type === SpecTypes.Boolean)) {
            return null;
        }

        const _valueSpec = cloneDeep(spec.properties[OBJECT_VALUE_PROPERTY_NAME]);

        _valueSpec.viewSpec.layout = 'transparent';

        const togglerInput = (
            <ViewController
                spec={_valueSpec}
                name={`${name ? name + '.' : ''}${OBJECT_VALUE_PROPERTY_NAME}`}
            />
        );

        if (Layout) {
            return <Layout {...props}>{togglerInput}</Layout>;
        }

        return <React.Fragment>{togglerInput}</React.Fragment>;
    }, [Layout, name, props, spec.properties, specProperties]);

    const valueKey = React.useMemo(() => {
        const oneOfValue = String(value[OBJECT_VALUE_PROPERTY_NAME]);

        if (isBooleanOneOfValue(oneOfValue)) {
            return oneOfValue;
        }

        return null;
    }, [value]);

    if (!toggler) {
        return null;
    }

    return (
        <div className={b({flat: withoutIndent})}>
            {toggler}
            {valueKey && specProperties[valueKey] ? (
                <GroupIndent>
                    <ViewController
                        spec={specProperties[valueKey]}
                        name={`${name ? name + '.' : ''}${valueKey}`}
                        key={`${name ? name + '.' : ''}${valueKey}`}
                    />
                </GroupIndent>
            ) : null}
        </div>
    );
};

export const BooleanOneOfViewFlat: ObjectIndependentView = (props) => (
    <BooleanOneOfView {...props} withoutIndent />
);
