import React from 'react';

import _ from 'lodash';

import {Card} from '../../';
import {
    Controller,
    FieldValue,
    ObjectIndependentInput,
    ValidateError,
    isArrayItem,
} from '../../../../core';
import {useErrorChecker, useOneOf} from '../../../hooks';
import {Row} from '../../Layouts';
import {RemoveButton} from '../../Layouts/Accordeon/RemoveButton';

export const CardOneOf: ObjectIndependentInput = (props) => {
    const {input, meta, spec, name} = props;

    const [open, setOpen] = React.useState(true);

    const onToggle = React.useCallback(() => setOpen((f) => !f), [setOpen]);
    const onOpen = React.useCallback(() => setOpen(true), [setOpen]);

    const {oneOfValue, specProperties, togglerInput} = useOneOf({
        props,
        onTogglerChange: onOpen,
    });

    const toggler = React.useMemo(
        () => (
            <Row {...props} name="__stub-name">
                {togglerInput}
            </Row>
        ),
        [togglerInput, props],
    );

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
            const value = _.set({}, childName.split(`${input.name}.`).join(''), childValue);

            input.onChange(value, childErrors);
        },
        [input.onChange, input.name],
    );

    const parentOnUnmount = React.useCallback(
        (childName: string) => input.onChange((currentValue) => currentValue, {[childName]: false}),
        [input.onChange],
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
                    initialValue={input.value?.[oneOfValue]}
                    spec={specProperties[oneOfValue]}
                    name={`${name}.${oneOfValue}`}
                    parentOnChange={parentOnChange}
                    parentOnUnmount={parentOnUnmount}
                    key={`${name}.${oneOfValue}`}
                />
            ) : null}
        </Card>
    );
};
