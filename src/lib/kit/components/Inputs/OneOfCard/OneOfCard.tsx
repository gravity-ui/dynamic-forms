import React from 'react';

import _ from 'lodash';

import {AccordeonCard} from '../../';
import {
    Controller,
    FieldValue,
    ObjectIndependentInput,
    ObjectSpec,
    ValidateError,
    isArrayItem,
} from '../../../../core';
import {useErrorChecker, useOneOf} from '../../../hooks';
import {block} from '../../../utils';
import {Row2} from '../../Layouts';
import {RemoveButton} from '../../Layouts/Accordeon/RemoveButton';

import './OneOfCard.scss';

const b = block('oneof-card');

export const OneOfCard: ObjectIndependentInput = (props) => {
    const {input, meta, spec, name} = props;

    const [open, setOpen] = React.useState(true);

    const onToggle = React.useCallback(() => setOpen((f) => !f), [setOpen]);
    const onOpen = React.useCallback(() => setOpen(true), [setOpen]);

    const {oneOfValue, specProperties, togglerInput} = useOneOf({
        props,
        onTogglerChange: onOpen,
    });

    const arrayItem = React.useMemo(() => isArrayItem(name), [name]);

    const toggler = React.useMemo(() => {
        const specWithoutDescription: ObjectSpec = {
            ...props.spec,
            viewSpec: {
                ...props.spec.viewSpec,
                layoutDescription: '',
            },
        };

        const name = arrayItem ? '' : props.name;

        return (
            <Row2 {...props} spec={specWithoutDescription} name={name}>
                {togglerInput}
            </Row2>
        );
    }, [togglerInput, props, arrayItem]);

    const headerActionsTemplate = React.useMemo(() => {
        if (arrayItem) {
            return <RemoveButton onDrop={input.onDrop} />;
        }

        return null;
    }, [arrayItem, input.onDrop]);

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
        <AccordeonCard
            className={b()}
            header={toggler}
            description={spec.viewSpec.layoutDescription || ''}
            open={open}
            onToggle={onToggle}
            ignoreHeaderToggle={true}
            headerActionsTemplate={headerActionsTemplate}
        >
            {specProperties[oneOfValue] ? (
                <Controller
                    initialValue={props.input.value?.[oneOfValue]}
                    spec={specProperties[oneOfValue]}
                    name={`${name}.${oneOfValue}`}
                    parentOnChange={parentOnChange}
                    parentOnUnmount={parentOnUnmount}
                    key={`${name}.${oneOfValue}`}
                />
            ) : null}
        </AccordeonCard>
    );
};
