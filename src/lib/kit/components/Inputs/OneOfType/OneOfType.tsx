import React, {useMemo} from 'react';

import Ajv from 'ajv';
import _ from 'lodash';

import {GroupIndent} from '../../';
import {
    Controller,
    FieldValue,
    ObjectIndependentInput,
    ObjectIndependentInputProps,
    ObjectSpec,
    ValidateError,
    transformArrOut,
} from '../../../../core';
import {useOneOf} from '../../../hooks';
import {block} from '../../../utils';

import './OneOfType.scss';

const b = block('oneof-type');
// const VALUE_KEY = 'value';
const ajv = new Ajv({
    strict: false,
    strictSchema: false,
    strictTypes: false,
    strictRequired: false,
});

const preprareSchema = (schema: any) => {
    const copy = _.cloneDeep(schema);

    const parseSchema = (inner: any) => {
        delete inner.required;
        delete inner.viewSpec;

        if (inner.properties) {
            Object.entries(inner.properties).forEach(([_key, value]) => {
                parseSchema(value);
            });
        }

        if (inner.items) {
            parseSchema(inner.items);
        }
    };
    parseSchema(copy);

    return copy;
};

export interface OneOfTypeProps extends ObjectIndependentInputProps {
    withoutIndent?: boolean;
}

const getOneOfSpecDefaultType = (spec: ObjectSpec) =>
    spec.viewSpec?.order?.[0] || Object.keys(spec.properties || {})[0];

const OneOfTypeComponent: React.FC<OneOfTypeProps> = (props) => {
    const validatorSchema = React.useMemo(() => preprareSchema(props.spec), [props.spec]);
    const valueType = useMemo(
        () =>
            Object.keys(validatorSchema?.properties)?.find((key) =>
                ajv.validate(validatorSchema.properties[key], transformArrOut(props.input.value)),
            ) || getOneOfSpecDefaultType(props.spec),
        [[props.input.value]],
    );

    console.log('valueType', valueType);

    const {oneOfValue, specProperties, toggler} = useOneOf({
        props: {
            ...props,
            input: {
                ...props.input,
                value: valueType ? {[valueType]: props.input.value} : props.input.value,
            },
        },
    });

    const parentOnChange = React.useCallback(
        (
            _childName: string,
            childValue: FieldValue,
            childErrors?: Record<string, ValidateError>,
        ) => {
            // const value = _.set({}, childName.split(`${props.input.name}.`).join(''), childValue);

            // props.input.onChange(value, childErrors);
            //@ts-ignore
            props.input.onChange(childValue, childErrors);
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
                        // value={props.input.value?.[VALUE_KEY]}
                        // name={`${props.name}.${VALUE_KEY}`}
                        value={props.input.value}
                        name={props.name}
                        spec={specProperties[oneOfValue]}
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
