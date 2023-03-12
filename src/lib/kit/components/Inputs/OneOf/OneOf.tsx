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

    return (
        <div className={b()}>
            {specProperties[oneOfValue] ? (
                <GroupIndent>
                    <Controller
                        initialValue={props.input.value?.[oneOfValue]}
                        spec={specProperties[oneOfValue]}
                        name={`${props.name}.${oneOfValue}`}
                        parentOnChange={parentOnChange}
                        key={`${props.name}.${oneOfValue}`}
                    />
                </GroupIndent>
            ) : null}
            <div className={b('toggler')}>{toggler}</div>
        </div>
    );
};
