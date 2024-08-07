import React from 'react';

import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';

import {FieldValue, ObjectIndependentInput, ValidateError, isStringSpec} from '../../../../core';
/* import {block} from '../../../utils';
 */
import {TimeRangeSelect} from './components';
import {filterTimeArray} from './utils';

/* import './TimeRangeSelector.scss';

const b = block('time-range-selector'); */

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

    const [timeOptions, setTimeOptions] = React.useState({
        startTimeOptions: defaultTimeOptions.slice(0, -1),
        endTimeOptions: defaultTimeOptions.slice(1),
    });

    const parentOnChange = React.useCallback(
        (childName: string, childValue: FieldValue, childErrors?: Record<string, ValidateError>) =>
            input.onChange(
                (currentValue) =>
                    set({...currentValue}, childName.split(`${name}.`).join(''), childValue),
                childErrors,
            ),
        [input, name],
    );

    const handleChange = React.useCallback(
        (value: string[], fieldName: string) => {
            const newValue = value[0];

            parentOnChange(fieldName, newValue);

            if (fieldName === START_TIME) {
                setTimeOptions((store) => ({
                    ...store,
                    endTimeOptions: filterTimeArray(defaultTimeOptions, newValue, 'greater'),
                }));
            }

            if (fieldName === END_TIME) {
                setTimeOptions((store) => ({
                    ...store,
                    startTimeOptions: filterTimeArray(defaultTimeOptions, newValue, 'less'),
                }));
            }
        },
        [defaultTimeOptions, parentOnChange],
    );

    if (!startTimeSpec || !endTimeSpec) {
        return null;
    }

    const content = (
        <React.Fragment>
            <TimeRangeSelect
                spec={startTimeSpec}
                name={START_TIME}
                options={timeOptions.startTimeOptions}
                value={input.value?.[START_TIME]}
                placeholder={timeOptions.startTimeOptions[0]?.content}
                handleChange={(value) => handleChange(value, START_TIME)}
            />
            <TimeRangeSelect
                spec={endTimeSpec}
                name={END_TIME}
                options={timeOptions.endTimeOptions}
                value={input.value?.[END_TIME]}
                placeholder={timeOptions.endTimeOptions[0]?.content}
                handleChange={(value) => handleChange(value, END_TIME)}
            />
        </React.Fragment>
    );

    if (Layout) {
        return <Layout {...props}>{content}</Layout>;
    }

    return <React.Fragment>{content}</React.Fragment>;
};
