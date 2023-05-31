import React from 'react';

import _ from 'lodash';

import {GroupIndent} from '../../';
import {
    Controller,
    FieldValue,
    ObjectIndependentInput,
    ObjectIndependentInputProps,
    ValidateError,
} from '../../../../core';
import {useOneOf} from '../../../hooks';
import {block} from '../../../utils';

import './OneOfType.scss';

const b = block('oneof-type');
const VALUE_KEY = 'value';

export interface OneOfTypeProps extends ObjectIndependentInputProps {
    withoutIndent?: boolean;
}

const OneOfTypeComponent: React.FC<OneOfTypeProps> = (props) => {
    const valueType = React.useMemo(() => {
        if (_.isArray(props.input.value?.[VALUE_KEY])) {
            return 'array';
        }

        if (_.isBoolean(props.input.value?.[VALUE_KEY])) {
            return 'boolean';
        }

        if (_.isNumber(props.input.value?.[VALUE_KEY])) {
            return 'number';
        }

        if (_.isObject(props.input.value?.[VALUE_KEY])) {
            return 'object';
        }

        if (_.isString(props.input.value?.[VALUE_KEY])) {
            return 'string';
        }

        return;
    }, [props.input.value]);

    const {oneOfValue, specProperties, toggler} = useOneOf({
        props: {
            ...props,
            input: {
                ...props.input,
                value: valueType ? {[valueType]: props.input.value[VALUE_KEY]} : props.input.value,
            },
        },
    });

    const parentOnChange = React.useCallback(
        (
            childName: string,
            childValue: FieldValue,
            childErrors?: Record<string, ValidateError>,
        ) => {
            const value = _.set({}, childName.split(`${props.input.name}.`).join(''), childValue);

            props.input.onChange(value, childErrors);
        },
        [props.input.onChange, props.input.name],
    );

    const parentOnUnmount = React.useCallback(
        (childName: string) =>
            props.input.onChange((currentValue) => currentValue, {[childName]: false}),
        [props.input.onChange],
    );

    return (
        <div
            className={b({
                base: !props.withoutIndent,
                flat: props.withoutIndent,
            })}
        >
            <div>{toggler}</div>
            {specProperties[oneOfValue] ? (
                <GroupIndent>
                    <Controller
                        value={props.input.value?.[VALUE_KEY]}
                        spec={specProperties[oneOfValue]}
                        name={`${props.name}.${VALUE_KEY}`}
                        parentOnChange={parentOnChange}
                        parentOnUnmount={parentOnUnmount}
                        key={`${props.name}.${oneOfValue}`}
                    />
                </GroupIndent>
            ) : null}
        </div>
    );
};

export const OneOfType = OneOfTypeComponent;

export const OneOfTypeFlat: ObjectIndependentInput = (props) => (
    <OneOfTypeComponent {...props} withoutIndent />
);
