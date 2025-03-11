import React from 'react';

import set from 'lodash/set';

import {Card} from '../../';
import type {FieldValue, ObjectIndependentInput, ValidateError} from '../../../../core';
import {Controller, isArrayItem} from '../../../../core';
import {useErrorChecker, useOneOf} from '../../../hooks';
import {Row} from '../../Layouts';
import {RemoveButton} from '../../RemoveButton';

export const CardOneOf: ObjectIndependentInput = (props) => {
    const {input, meta, spec, name, Layout} = props;

    const [open, setOpen] = React.useState(true);

    const onToggle = React.useCallback(() => setOpen((f) => !f), [setOpen]);
    const onOpen = React.useCallback(() => setOpen(true), [setOpen]);

    const {oneOfValue, specProperties, togglerInput} = useOneOf({
        props,
        onTogglerChange: onOpen,
    });

    const toggler = React.useMemo(() => {
        const togglerProps = {
            ...props,
            name: '__stub-name',
            children: togglerInput,
        } as const;

        if (Layout) {
            return <Layout {...togglerProps} />;
        }

        return <Row {...togglerProps} />;
    }, [togglerInput, props, Layout]);

    const actions = React.useMemo(() => {
        if (isArrayItem(name)) {
            return <RemoveButton onDrop={input.onDrop} name={name} />;
        }

        return;
    }, [name, input.onDrop]);

    const parentOnChange = React.useCallback(
        (
            childName: string,
            childValue: FieldValue,
            childErrors?: Record<string, ValidateError>,
        ) => {
            const value = set({}, childName.split(`${input.name}.`).join(''), childValue);

            input.onChange(value, childErrors);
        },
        [input.onChange, input.name],
    );

    useErrorChecker({name, meta, open, setOpen});

    return (
        <Card
            name={name}
            title={toggler}
            description={spec.viewSpec.layoutDescription}
            actions={actions}
            open={open}
            onToggle={onToggle}
            disableHeaderToggle
        >
            {specProperties[oneOfValue] ? (
                <Controller
                    value={input.value?.[oneOfValue]}
                    spec={specProperties[oneOfValue]}
                    name={`${name}.${oneOfValue}`}
                    parentOnChange={parentOnChange}
                    parentOnUnmount={input.parentOnUnmount}
                    key={`${name}.${oneOfValue}`}
                />
            ) : null}
        </Card>
    );
};
