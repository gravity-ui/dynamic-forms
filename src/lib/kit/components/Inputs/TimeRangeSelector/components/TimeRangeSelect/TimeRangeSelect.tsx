import React from 'react';

import isString from 'lodash/isString';

import {Select, type SelectOption} from '@gravity-ui/uikit';

import {
    FieldObjectValue,
    FieldValue,
    IndependentInputProps,
    ObjectSpec,
    StringSpec,
} from '../../../../../../core';

import {block} from '../../../../../utils';

import {Row} from '../../../../Layouts/Row';

import './TimeRangeSelect.scss';

const b = block('time-range-select');

interface TimeRangeSelectProps {
    spec: StringSpec<any, undefined, undefined>;
    name: string;
    options: SelectOption<string>[];
    value?: FieldValue;
    placeholder?: string;
    handleChange: (value: string[]) => void;
    props: IndependentInputProps<
        FieldObjectValue,
        undefined,
        undefined,
        ObjectSpec<undefined, undefined, undefined>
    >;
}

export const TimeRangeSelect: React.FC<TimeRangeSelectProps> = ({
    name,
    spec,
    options,
    value,
    placeholder,
    props,
    handleChange,
}) => {
    const filterable = React.useMemo(() => (options?.length || 0) > 9, [options?.length]);

    const _value = React.useMemo(() => {
        if (isString(value)) {
            return [value];
        }

        return undefined;
    }, [value]);

    return (
        <Row {...{...props, spec}}>
            <Select
                className={b('select')}
                filterable={filterable}
                value={_value}
                options={options}
                onUpdate={handleChange}
                disabled={spec.viewSpec.disabled}
                placeholder={spec.viewSpec.placeholder || placeholder}
                filterPlaceholder={spec.viewSpec.selectParams?.filterPlaceholder}
                qa={name}
                popupClassName={b('select-popup')}
            />
        </Row>
    );
};
