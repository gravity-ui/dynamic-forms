import React from 'react';

import {Select} from '@gravity-ui/uikit';
import _ from 'lodash';

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
            const _value = _.set(value || {}, childName.split(`${name}.`).join(''), childValue);

            onChange(_value, childErrors);
        },
        [name, onChange, value],
    );

    const specProperties = React.useMemo(
        () => (_.isObjectLike(spec.properties) ? spec.properties! : {}),
        [spec.properties],
    );

    const options = React.useMemo(
        () =>
            (spec.viewSpec.order || Object.keys(specProperties)).map((value) => {
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
        [spec.description, spec.viewSpec.order, specProperties],
    );

    const filterable = React.useMemo(() => (options.length || 0) > 9, [options.length]);

    const selectInput = React.useMemo(
        () => (
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
        ),
        [
            filterable,
            handleOpenChange,
            name,
            options,
            spec.viewSpec.disabled,
            spec.viewSpec.placeholder,
            valueSelect,
        ],
    );

    const header = React.useMemo(() => {
        if (Layout) {
            return <Layout {...props}>{selectInput}</Layout>;
        }

        return <React.Fragment>{selectInput}</React.Fragment>;
    }, [Layout, props, selectInput]);

    const content = React.useCallback(
        (value: string[]) => (
            <React.Fragment>
                {value.map((property) => (
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
            </React.Fragment>
        ),
        [specProperties, name, parentOnUnmount, parentOnChange, input.value],
    );

    if (!options) {
        return null;
    }

    return (
        <React.Fragment>
            {header}
            <div
                className={b('content', {
                    flat: withoutIndent,
                })}
            >
                <GroupIndent>{content(valueSelect)}</GroupIndent>
            </div>
        </React.Fragment>
    );
};

export const MultiOneOfFlat: ObjectIndependentInput = (props) => (
    <MultiOneOf {...props} withoutIndent />
);
