import React from 'react';

import {Select} from '@gravity-ui/uikit';
import isObjectLike from 'lodash/isObjectLike';
import set from 'lodash/set';

import {
    Controller,
    FieldValue,
    ObjectIndependentInput,
    ObjectIndependentInputProps,
    ValidateError,
} from '../../../../core';
import {block} from '../../../utils';
import {GroupIndent} from '../../GroupIndent';

import './MultiOneOf.scss';

const b = block('multi-oneof');

export interface MultiOneOfProps extends ObjectIndependentInputProps {
    withoutIndent?: boolean;
}

export const MultiOneOf: React.FC<MultiOneOfProps> = (props) => {
    const {name, input, spec, Layout, withoutIndent} = props;
    const {value, onBlur, onChange, onFocus, parentOnUnmount} = input;

    const [valueSelect, setValueSelect] = React.useState(() => (value ? Object.keys(value) : []));

    const handleOpenChange = React.useCallback(
        (open: boolean) => {
            if (open) {
                onFocus();
            } else {
                onBlur();
            }
        },
        [onFocus, onBlur],
    );

    const parentOnChange = React.useCallback(
        (
            childName: string,
            childValue: FieldValue,
            childErrors?: Record<string, ValidateError>,
        ) => {
            onChange(
                (currentValue) =>
                    set({...currentValue}, childName.split(`${name}.`).join(''), childValue),
                childErrors,
            );
        },
        [name, onChange],
    );

    const specProperties = React.useMemo(
        () => (isObjectLike(spec.properties) ? spec.properties! : {}),
        [spec.properties],
    );

    const propertiesOrder = React.useMemo(
        () => (spec.viewSpec.order?.length ? spec.viewSpec.order : Object.keys(specProperties)),
        [spec.viewSpec.order, specProperties],
    );

    const options = React.useMemo(
        () =>
            propertiesOrder.map((value) => {
                const title =
                    spec.description?.[value] ||
                    specProperties[value]?.viewSpec.layoutTitle ||
                    value ||
                    '';

                return {
                    value,
                    title,
                    content: title,
                };
            }),
        [propertiesOrder, spec.description, specProperties],
    );

    const filterable = React.useMemo(() => (options.length || 0) > 9, [options.length]);

    const selectInput = React.useMemo(() => {
        const select = (
            <Select
                width="max"
                value={valueSelect}
                options={options}
                onUpdate={setValueSelect}
                onOpenChange={handleOpenChange}
                disabled={spec.viewSpec.disabled}
                placeholder={spec.viewSpec.placeholder}
                filterable={filterable}
                multiple
                className={b('select')}
                qa={name}
            />
        );

        if (Layout) {
            return <Layout {...props}>{select}</Layout>;
        }

        return <React.Fragment>{select}</React.Fragment>;
    }, [
        Layout,
        filterable,
        handleOpenChange,
        name,
        options,
        props,
        spec.viewSpec.disabled,
        spec.viewSpec.placeholder,
        valueSelect,
    ]);

    if (!options) {
        return null;
    }

    return (
        <React.Fragment>
            {selectInput}
            <div
                className={b('content', {
                    flat: withoutIndent,
                })}
            >
                <GroupIndent>
                    {valueSelect.map((property) => (
                        <React.Fragment key={property}>
                            {specProperties && specProperties[property] ? (
                                <Controller
                                    name={`${name}.${property}`}
                                    spec={specProperties[property]}
                                    parentOnUnmount={parentOnUnmount}
                                    parentOnChange={parentOnChange}
                                    value={input.value?.[property]}
                                />
                            ) : null}
                        </React.Fragment>
                    ))}
                </GroupIndent>
            </div>
        </React.Fragment>
    );
};

export const MultiOneOfFlat: ObjectIndependentInput = (props) => (
    <MultiOneOf {...props} withoutIndent />
);
