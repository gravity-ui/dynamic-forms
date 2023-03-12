import React from 'react';

import _ from 'lodash';

import {AccordeonCard} from '../';
import {ObjectIndependentView, ViewController} from '../../../core';

export const OneOfCardView: ObjectIndependentView = (props) => {
    const {value = {}, spec, Layout, name} = props;

    const [open, setOpen] = React.useState(true);

    const onToggle = React.useCallback(() => setOpen((f) => !f), [setOpen]);

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
        <AccordeonCard
            className="df-accordeon-card-layout"
            header={wrappedValue}
            open={open}
            onToggle={onToggle}
            ignoreHeaderToggle={true}
        >
            {specProperties[valueKey] ? (
                <ViewController
                    spec={specProperties[valueKey]}
                    name={`${name}.${valueKey}`}
                    key={`${name}.${valueKey}`}
                />
            ) : null}
        </AccordeonCard>
    );
};
