import React from 'react';

import isObjectLike from 'lodash/isObjectLike';

import {Card, ViewRow} from '../';
import {ObjectIndependentView, ViewController} from '../../../core';

export const CardOneOfView: ObjectIndependentView = (props) => {
    const {value = {}, spec, name, Layout} = props;

    const [open, setOpen] = React.useState(true);

    const onToggle = React.useCallback(() => setOpen((f) => !f), [setOpen]);

    const specProperties = React.useMemo(
        () => (isObjectLike(spec.properties) ? spec.properties! : {}),
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

    const title = React.useMemo(() => {
        const titleProps = {
            spec: spec,
            value: valueName as any,
            name: name,
            children: <>{valueName}</>,
        } as const;

        if (Layout) {
            return <Layout {...titleProps} />;
        }

        return <ViewRow {...titleProps} />;
    }, [spec, name, valueName, Layout]);

    if (!value || !Object.keys(value).length) {
        return null;
    }

    return (
        <Card
            name={name}
            title={title}
            open={open}
            onToggle={onToggle}
            disableHeaderToggle
            checkEmptyBody
        >
            {specProperties[valueKey] ? (
                <ViewController
                    spec={specProperties[valueKey]}
                    name={`${name ? name + '.' : ''}${valueKey}`}
                    key={`${name ? name + '.' : ''}${valueKey}`}
                />
            ) : null}
        </Card>
    );
};
