import React from 'react';

import cloneDeep from 'lodash/cloneDeep';

import {ObjectIndependentView, ViewController, isStringSpec} from '../../../../core';
import {END_TIME, START_TIME} from '../../../constants/common';

export const TimeRangeSelectorView: ObjectIndependentView = ({
    value,
    spec,
    name,
    Layout,
    ...restProps
}) => {
    const {startTimeSpec, endTimeSpec} = React.useMemo(() => {
        const [startTimeSpec, endTimeSpec] = [START_TIME, END_TIME].map((key) => {
            if (spec.properties?.[key] && isStringSpec(spec.properties[key])) {
                const _spec = cloneDeep(spec.properties[key]);

                _spec.viewSpec.layout = 'row';

                return _spec;
            }

            return undefined;
        });

        return {startTimeSpec, endTimeSpec};
    }, [spec.properties]);

    if (!startTimeSpec || !endTimeSpec) {
        return null;
    }

    const content = (
        <React.Fragment>
            <ViewController spec={startTimeSpec} name={`${name ? name + '.' : ''}${START_TIME}`} />
            <ViewController spec={endTimeSpec} name={`${name ? name + '.' : ''}${END_TIME}`} />
        </React.Fragment>
    );

    if (Layout) {
        return (
            <Layout spec={spec} name={name} value={value} {...restProps}>
                {content}
            </Layout>
        );
    }

    return <React.Fragment>{content}</React.Fragment>;
};
