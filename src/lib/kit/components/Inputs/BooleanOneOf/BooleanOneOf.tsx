import React from 'react';

import set from 'lodash/set';
import isObjectLike from 'lodash/isObjectLike';
import cloneDeep from 'lodash/cloneDeep';

import {GroupIndent} from '../../GroupIndent';
import {
    BooleanOneOfValue,
    Controller,
    FieldValue,
    ObjectIndependentInput,
    ObjectIndependentInputProps,
    SpecTypes,
    ValidateError,
    isBooleanOneOfValue,
} from '../../../../core';
import {block} from '../../../utils';
import {OBJECT_VALUE_PROPERTY_NAME} from '../../../constants/common';

import './BooleanOneOf.scss';
import {isUndefined} from 'lodash';

const b = block('boolean-oneof');

export interface BooleanOneOfProps extends ObjectIndependentInputProps {
    withoutIndent?: boolean;
}

export const BooleanOneOf: React.FC<BooleanOneOfProps> = (props) => {
    const {spec, name, Layout, input, withoutIndent} = props;

    const specProperties = React.useMemo(
        () => (isObjectLike(spec.properties) ? spec.properties! : {}),
        [spec.properties],
    );

    const [oneOfValue, setOneOfValue] = React.useState<BooleanOneOfValue>(() => {
        const initalValue = String(input.value?.[OBJECT_VALUE_PROPERTY_NAME]);

        if (isBooleanOneOfValue(initalValue)) {
            return initalValue as BooleanOneOfValue;
        }

        return BooleanOneOfValue.FALSE;
    });

    const parentOnChange = React.useCallback(
        (childName: string, childValue: FieldValue, childErrors?: Record<string, ValidateError>) =>
            input.onChange(
                (currentValue) =>
                    set({...currentValue}, childName.split(`${name}.`).join(''), childValue),
                childErrors,
            ),
        [input.onChange, input.name],
    );

    const booleanOneOfChange = React.useCallback(
        (
            childName: string,
            childValue: FieldValue,
            childErrors?: Record<string, ValidateError>,
        ) => {
            parentOnChange(childName, childValue, childErrors);

            if (isBooleanOneOfValue(String(childValue))) {
                setOneOfValue(childValue as BooleanOneOfValue);
            }
        },
        [parentOnChange],
    );

    const valueSpec = React.useMemo(
        () => specProperties[OBJECT_VALUE_PROPERTY_NAME],
        [specProperties],
    );

    const toggler = React.useMemo(() => {
        if (!(valueSpec && valueSpec.type === SpecTypes.Boolean)) {
            return null;
        }

        const _valueSpec = cloneDeep(spec.properties[OBJECT_VALUE_PROPERTY_NAME]);

        _valueSpec.viewSpec.layout = 'transparent';

        const togglerInput = (
            <Controller
                spec={_valueSpec}
                name={`${name}.${OBJECT_VALUE_PROPERTY_NAME}`}
                value={input.value?.[OBJECT_VALUE_PROPERTY_NAME]}
                parentOnChange={booleanOneOfChange}
                parentOnUnmount={input.parentOnUnmount}
            />
        );

        if (Layout) {
            return <Layout {...props}>{togglerInput}</Layout>;
        }

        return <React.Fragment>{togglerInput}</React.Fragment>;
    }, [
        Layout,
        booleanOneOfChange,
        input.parentOnUnmount,
        input.value,
        name,
        props,
        spec.properties,
        valueSpec,
    ]);

    React.useEffect(() => {
        if (
            isUndefined(input.value?.[OBJECT_VALUE_PROPERTY_NAME]) &&
            valueSpec &&
            valueSpec.type === SpecTypes.Boolean
        ) {
            parentOnChange(`${name}.${OBJECT_VALUE_PROPERTY_NAME}`, false);
        }
    }, []);

    if (!toggler) {
        return null;
    }

    return (
        <div
            className={b({
                base: !withoutIndent,
                flat: withoutIndent,
            })}
        >
            {toggler}
            {specProperties[oneOfValue] ? (
                <GroupIndent>
                    <Controller
                        value={input.value?.[oneOfValue]}
                        spec={specProperties[oneOfValue]}
                        name={`${name}.${oneOfValue}`}
                        parentOnChange={parentOnChange}
                        parentOnUnmount={input.parentOnUnmount}
                        key={`${name}.${oneOfValue}`}
                    />
                </GroupIndent>
            ) : null}
        </div>
    );
};

export const BooleanOneOfFlat: ObjectIndependentInput = (props) => (
    <BooleanOneOf {...props} withoutIndent />
);
