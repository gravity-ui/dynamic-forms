import React from 'react';

import {Select} from '@gravity-ui/uikit';
import _ from 'lodash';
import {useField} from 'react-final-form';

import {
    Accordeon,
    Controller,
    FieldValue,
    ObjectIndependentInput,
    Row,
    Spec,
    SpecTypes,
    ValidateError,
} from '../../../lib';

import {getOptionsSpec} from './utils';

export const SpecSelector: ObjectIndependentInput = (props) => {
    const inputField = useField('input');
    const [type, setType] = React.useState<string>(
        Object.keys(props.input.value || {})[0] || SpecTypes.String,
    );

    const options = React.useMemo(
        () =>
            Object.values(SpecTypes).map((type) => ({
                id: type,
                value: type,
                content: type.charAt(0).toUpperCase() + type.slice(1),
                key: type,
            })),
        [],
    );

    const handleUpdate = React.useCallback(
        ([value]: string[]) => {
            setType(value);
            inputField.input.onChange(undefined);
            props.input.onChange({[value]: {type: value, viewSpec: {type: ''}}});
        },
        [setType, props.input.onChange, inputField.input.onChange],
    );

    const optionsSpec = React.useMemo(
        () =>
            getOptionsSpec({type: type as SpecTypes, viewSpec: {type: ''}}, []) as unknown as Spec,
        [type],
    );

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

    const typeSpec = React.useMemo(
        () => ({
            type: SpecTypes.String,
            viewSpec: {type: 'select', layout: 'row', layoutTitle: 'Type'},
        }),
        [],
    );

    React.useEffect(() => {
        if (!Object.keys(props.input.value || {})[0]) {
            props.input.onChange({[type]: {type, viewSpec: {type: ''}}});
        }
    }, []);

    return (
        <Accordeon {...props}>
            <React.Fragment>
                <Row {...{...props, spec: typeSpec}}>
                    <Select width="max" value={[type]} options={options} onUpdate={handleUpdate} />
                </Row>
                <Controller
                    value={props.input.value?.[type]}
                    spec={optionsSpec}
                    name={`${props.name}.${type}`}
                    parentOnChange={parentOnChange}
                    parentOnUnmount={parentOnUnmount}
                    key={`${props.name}.${type}`}
                />
            </React.Fragment>
        </Accordeon>
    );
};
