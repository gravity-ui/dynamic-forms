import React from 'react';

import isObjectLike from 'lodash/isObjectLike';

import {GroupIndent} from '../../';
import type {ObjectIndependentView, ObjectIndependentViewProps} from '../../../../core';
import {ViewController} from '../../../../core';
import {block, objectKeys} from '../../../utils';

import './OneOfView.scss';

const b = block('oneof-view');

export interface OneOfViewProps extends ObjectIndependentViewProps {
    withoutIndent?: boolean;
}

const OneOfViewComponent: React.FC<OneOfViewProps> = (props) => {
    const {value = {}, spec, Layout, name} = props;

    const specProperties = React.useMemo(
        () => (isObjectLike(spec.properties) ? spec.properties! : {}),
        [spec.properties],
    );

    const specBooleanMap = React.useMemo(
        () => spec.viewSpec.oneOfParams?.booleanMap,
        [spec.viewSpec.oneOfParams?.booleanMap],
    );

    const valueKey = React.useMemo(() => Object.keys(value)[0], [value]);

    const valueName = React.useMemo(() => {
        if (spec.viewSpec.oneOfParams?.toggler === 'checkbox' && specBooleanMap) {
            return objectKeys(specBooleanMap).find((key) => specBooleanMap[key] === valueKey);
        }

        return (
            spec.description?.[valueKey] ||
            specProperties[valueKey]?.viewSpec.layoutTitle ||
            valueKey
        );
    }, [
        valueKey,
        spec.description,
        specProperties,
        spec.viewSpec.oneOfParams?.toggler,
        specBooleanMap,
    ]);

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

    if (!value || !Object.keys(value).length) {
        return null;
    }

    return (
        <div className={b({flat: props.withoutIndent})}>
            {wrappedValue}
            {specProperties[valueKey] ? (
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

export const OneOfView = OneOfViewComponent;

export const OneOfFlatView: ObjectIndependentView = (props) => (
    <OneOfViewComponent {...props} withoutIndent />
);
