import React from 'react';

import _ from 'lodash';

import {GroupIndent} from '../../';
import {Controller, FieldValue, ObjectIndependentInput, ValidateError} from '../../../../core';
import {useOneOf} from '../../../hooks';
import {block} from '../../../utils';

import './OneOf.scss';

const b = block('oneof');

export const OneOf: ObjectIndependentInput = (props) => {
    const {oneOfValue, specProperties, toggler} = useOneOf({props});

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
        <div className={b()}>
            <div>{toggler}</div>
            {specProperties[oneOfValue] ? (
                <GroupIndent>
                    <Controller
                        value={props.input.value?.[oneOfValue]}
                        spec={specProperties[oneOfValue]}
                        name={`${props.name}.${oneOfValue}`}
                        parentOnChange={parentOnChange}
                        parentOnUnmount={parentOnUnmount}
                        key={`${props.name}.${oneOfValue}`}
                    />
                </GroupIndent>
            ) : null}
        </div>
    );
};
