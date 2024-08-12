import React from 'react';

import {Text} from '@gravity-ui/uikit';

import isString from 'lodash/isString';
import set from 'lodash/set';

import {
    FieldValue,
    ObjectIndependentInput,
    StringSpec,
    ValidateError,
    isStringSpec,
} from '../../../../core';
import {END_TIME, START_TIME} from '../../../constants/common';

import {TimeRangeSelect} from './components';
import {filterTimeArray, validateArray} from './utils';

export const TimeRangeSelector: ObjectIndependentInput = (props) => {
    const {spec, input, name, Layout} = props;

    const [startTimeSpec, endTimeSpec] = React.useMemo(
        () =>
            [START_TIME, END_TIME].map((key) =>
                isStringSpec(spec.properties?.[key])
                    ? (spec.properties?.[key] as StringSpec<any, undefined, undefined>)
                    : undefined,
            ),
        [spec.properties],
    );

    const {initialStartTimeOptions, initialEndTimeOptions, canBeFiltered} = React.useMemo(() => {
        const [initialStartTimeOptions, initialEndTimeOptions] = [startTimeSpec, endTimeSpec].map(
            (spec) => {
                if (spec && spec.enum) {
                    return spec.enum.map((id) => ({
                        id,
                        value: id,
                        text: spec.description?.[id] || id,
                        content: spec.viewSpec.selectParams?.meta?.[id] ? (
                            <div key={id}>
                                <Text>{spec.description?.[id] || id}</Text>
                                <Text color="secondary" as="div">
                                    {spec.viewSpec.selectParams.meta[id]}
                                </Text>
                            </div>
                        ) : (
                            spec.description?.[id] || id
                        ),
                        key: id,
                    }));
                }

                return undefined;
            },
        );

        const canBeFiltered =
            initialStartTimeOptions &&
            initialEndTimeOptions &&
            validateArray(initialStartTimeOptions) &&
            validateArray(initialEndTimeOptions);

        return {
            initialStartTimeOptions,
            initialEndTimeOptions,
            canBeFiltered,
        };
    }, [endTimeSpec, startTimeSpec]);

    const {startTimeOptions, endTimeOptions} = React.useMemo(() => {
        let startTimeOptions = initialStartTimeOptions;
        let endTimeOptions = initialEndTimeOptions;

        [START_TIME, END_TIME].forEach((key) => {
            const time = input.value?.[key];

            if (
                isString(time) &&
                canBeFiltered &&
                initialEndTimeOptions &&
                initialStartTimeOptions
            ) {
                if (START_TIME === key) {
                    endTimeOptions = filterTimeArray(initialEndTimeOptions, time, 'greater');
                } else {
                    startTimeOptions = filterTimeArray(initialStartTimeOptions, time, 'less');
                }
            }
        });

        return {startTimeOptions, endTimeOptions};
    }, [canBeFiltered, initialEndTimeOptions, initialStartTimeOptions, input.value]);

    const parentOnChange = React.useCallback(
        (childName: string, childValue: FieldValue, childErrors?: Record<string, ValidateError>) =>
            input.onChange(
                (currentValue) =>
                    set({...currentValue}, childName.split(`${name}.`).join(''), childValue),
                childErrors,
            ),
        [input, name],
    );

    if (!startTimeSpec || !endTimeSpec || !startTimeOptions || !endTimeOptions) {
        return null;
    }

    const content = (
        <React.Fragment>
            <TimeRangeSelect
                spec={startTimeSpec}
                name={`${name}.${START_TIME}`}
                options={startTimeOptions}
                value={input.value?.[START_TIME]}
                placeholder={startTimeOptions[0]?.text}
                handleChange={(value) => parentOnChange(START_TIME, value[0])}
                props={props}
            />
            <TimeRangeSelect
                spec={endTimeSpec}
                name={`${name}.${END_TIME}`}
                options={endTimeOptions}
                value={input.value?.[END_TIME]}
                placeholder={endTimeOptions[0]?.text}
                handleChange={(value) => parentOnChange(END_TIME, value[0])}
                props={props}
            />
        </React.Fragment>
    );

    if (Layout) {
        return <Layout {...props}>{content}</Layout>;
    }

    return <React.Fragment>{content}</React.Fragment>;
};
