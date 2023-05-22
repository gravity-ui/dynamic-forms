import React from 'react';

import _ from 'lodash';

import {GroupIndent} from '../../';
import {ObjectIndependentView, ObjectIndependentViewProps, ViewController} from '../../../../core';
import {block} from '../../../utils';

import './OneOfView.scss';

const b = block('oneof-view');

export interface OneOfViewProps extends ObjectIndependentViewProps {
    withoutIndent?: boolean;
}

const OneOfViewComponent: React.FC<OneOfViewProps> = (props) => {
    const {value = {}, spec, Layout, name} = props;

    const specProperties = React.useMemo(
        () => (_.isObjectLike(spec.properties) ? spec.properties! : {}),
        [spec.properties],
    );

    const valueKey = React.useMemo(() => Object.keys(value)[0], [value]);

    const valueName = React.useMemo(() => {
        return (
            spec.description?.[valueKey] ||
            specProperties[valueKey]?.viewSpec.layoutTitle ||
            valueKey
        );
    }, [valueKey, spec.description, specProperties]);

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
                        name={`${name}.${valueKey}`}
                        key={`${name}.${valueKey}`}
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
