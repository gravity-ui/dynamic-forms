import React from 'react';

import _ from 'lodash';

import {GroupIndent} from '../../';
import {ObjectIndependentView, ObjectIndependentViewProps, ViewController} from '../../../../core';
import {block} from '../../../utils';

import './OneOfTypeView.scss';

const b = block('oneof-type-view');
const VALUE_KEY = 'value';

export interface OneOfTypeViewProps extends ObjectIndependentViewProps {
    withoutIndent?: boolean;
}

const OneOfTypeViewComponent: React.FC<OneOfTypeViewProps> = (props) => {
    const {value = {}, spec, Layout, name} = props;

    const specProperties = React.useMemo(
        () => (_.isObjectLike(spec.properties) ? spec.properties! : {}),
        [spec.properties],
    );

    const valueType = React.useMemo(() => {
        if (_.isArray(value?.[VALUE_KEY])) {
            return 'array';
        }

        if (_.isBoolean(value?.[VALUE_KEY])) {
            return 'boolean';
        }

        if (_.isNumber(value?.[VALUE_KEY])) {
            return 'number';
        }

        if (_.isObject(value?.[VALUE_KEY])) {
            return 'object';
        }

        if (_.isString(value?.[VALUE_KEY])) {
            return 'string';
        }

        return;
    }, [value]);

    const valueName = React.useMemo(() => {
        if (valueType) {
            return spec.description?.[valueType] || specProperties[valueType]?.viewSpec.layoutTitle;
        }

        return valueType;
    }, [valueType, spec.description, specProperties]);

    const wrappedValue = React.useMemo(() => {
        if (Layout) {
            return (
                <Layout {...props} value={valueName as any}>
                    <>{valueName}</>
                </Layout>
            );
        }

        return valueName;
    }, [Layout, valueName]);

    if (!value || !valueType) {
        return null;
    }

    return (
        <div className={b({flat: props.withoutIndent})}>
            {wrappedValue}
            {specProperties[valueType] ? (
                <GroupIndent>
                    <ViewController
                        spec={specProperties[valueType]}
                        name={`${name}.${VALUE_KEY}`}
                        key={`${name}.${valueType}`}
                    />
                </GroupIndent>
            ) : null}
        </div>
    );
};

export const OneOfTypeView = OneOfTypeViewComponent;

export const OneOfTypeFlatView: ObjectIndependentView = (props) => (
    <OneOfTypeViewComponent {...props} withoutIndent />
);
