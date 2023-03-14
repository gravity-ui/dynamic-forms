import React from 'react';

import _ from 'lodash';

import {GroupIndent} from '../';
import {ObjectIndependentView, ViewController} from '../../../core';

export const OneOfView: ObjectIndependentView = (props) => {
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
        <React.Fragment>
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
        </React.Fragment>
    );
};
