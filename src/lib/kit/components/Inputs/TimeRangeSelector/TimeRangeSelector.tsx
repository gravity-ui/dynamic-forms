import React from 'react';

import cloneDeep from 'lodash/cloneDeep';
import isString from 'lodash/isString';
import set from 'lodash/set';

import {FieldValue, ObjectIndependentInput, ValidateError, isStringSpec} from '../../../../core';

import {TimeRangeSelect} from './components';
import {filterTimeArray} from './utils';

const START_TIME = 'start';
const END_TIME = 'end';

export const TimeRangeSelector: ObjectIndependentInput = (props) => {
    const {spec, input, name, Layout} = props;

    const {startTimeSpec, endTimeSpec} = React.useMemo(() => {
        let startTimeSpec, endTimeSpec;

        if (spec.properties?.[START_TIME] && isStringSpec(spec.properties[START_TIME])) {
            const _spec = cloneDeep(spec.properties[START_TIME]);

            startTimeSpec = _spec;
        }

        if (spec.properties?.[END_TIME] && isStringSpec(spec.properties[END_TIME])) {
            const _spec = cloneDeep(spec.properties[END_TIME]);

            endTimeSpec = _spec;
        }

        return {startTimeSpec, endTimeSpec};
    }, [spec.properties]);

    const defaultTimeOptions = React.useMemo(() => {
        const times: string[] = [];
        const totalMinutesInDay = 24 * 60;
        const step = spec.viewSpec.timeRangeSelectorParams?.timeStep || 60;

        for (let minutes = 0; minutes < totalMinutesInDay; minutes += step) {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            times.push(`${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`);
        }

        return times.map((time) => ({id: time, content: time, value: time}));
    }, [spec.viewSpec.timeRangeSelectorParams?.timeStep]);

    const {startTimeOptions, endTimeOptions} = React.useMemo(() => {
        let startTimeOptions = defaultTimeOptions.slice(0, -1);
        let endTimeOptions = defaultTimeOptions.slice(1);

        if (input.value?.[START_TIME] && isString(input.value[START_TIME])) {
            endTimeOptions = filterTimeArray(
                defaultTimeOptions,
                input.value[START_TIME],
                'greater',
            );
        }

        if (input.value?.[END_TIME] && isString(input.value[END_TIME])) {
            startTimeOptions = filterTimeArray(defaultTimeOptions, input.value[END_TIME], 'less');
        }

        return {startTimeOptions, endTimeOptions};
    }, [defaultTimeOptions, input.value]);

    const parentOnChange = React.useCallback(
        (childName: string, childValue: FieldValue, childErrors?: Record<string, ValidateError>) =>
            input.onChange(
                (currentValue) =>
                    set({...currentValue}, childName.split(`${name}.`).join(''), childValue),
                childErrors,
            ),
        [input, name],
    );

    if (!startTimeSpec || !endTimeSpec) {
        return null;
    }

    const content = (
        <React.Fragment>
            <TimeRangeSelect
                spec={startTimeSpec}
                name={`${name}.${START_TIME}`}
                options={startTimeOptions}
                value={input.value?.[START_TIME]}
                placeholder={startTimeOptions[0]?.content}
                handleChange={(value) => parentOnChange(START_TIME, value[0])}
                props={props}
            />
            <TimeRangeSelect
                spec={endTimeSpec}
                name={`${name}.${END_TIME}`}
                options={endTimeOptions}
                value={input.value?.[END_TIME]}
                placeholder={endTimeOptions[0]?.content}
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
