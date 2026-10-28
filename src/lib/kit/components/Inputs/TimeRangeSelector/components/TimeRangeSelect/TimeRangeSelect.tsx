import React from 'react';

import type {SelectOptionProps} from '@gravity-ui/uikit';

import {
    Controller,
    type ControllerProps,
    type FieldValue,
    type StringSpec,
} from '../../../../../../core';
import {block} from '../../../../../utils';
import type {SelectProps} from '../../../Select';

import './TimeRangeSelect.scss';

const b = block('time-range-select');

interface TimeRangeSelectProps extends ControllerProps<FieldValue, StringSpec> {
    options: SelectOptionProps<string>[];
}

export const TimeRangeSelect: React.FC<TimeRangeSelectProps> = ({spec, options, ...props}) => {
    const selectSpec = React.useMemo<StringSpec<any, any>>(
        () => ({
            ...spec,
            viewSpec: {
                ...spec.viewSpec,
                type: 'select',
                layout: 'row',
                inputProps: {
                    withCustomOptions: true,
                    options,
                    className: b('select'),
                    popupClassName: b('select-popup'),
                    width: undefined,
                } satisfies SelectProps,
            },
        }),
        [spec, options],
    );

    return <Controller {...props} spec={selectSpec} />;
};
