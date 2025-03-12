import React from 'react';

import {Select, type SelectOption} from '@gravity-ui/uikit';
import isString from 'lodash/isString';

import type {
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

    const renderOption = React.useCallback((option: {value: string; content?: React.ReactNode}) => {
        return <React.Fragment key={option.value}>{option.content || option.value}</React.Fragment>;
    }, []);

    const getOptionHeight = React.useCallback(() => {
        if (spec.viewSpec.selectParams?.meta) {
            return 44;
        }

        return 28;
    }, [spec.viewSpec.selectParams?.meta]);

    return (
        <Row {...{...props, spec}}>
            <Select
                className={b('select')}
                filterable={filterable}
                value={_value}
                options={options}
                onUpdate={handleChange}
                disabled={spec.viewSpec.disabled}
                placeholder={spec.viewSpec.placeholder}
                filterPlaceholder={spec.viewSpec.selectParams?.filterPlaceholder}
                renderOption={renderOption}
                getOptionHeight={getOptionHeight}
                qa={name}
                popupClassName={b('select-popup')}
            />
        </Row>
    );
};
