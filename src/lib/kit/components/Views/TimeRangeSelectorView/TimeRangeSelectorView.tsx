import React from 'react';

import cloneDeep from 'lodash/cloneDeep';

import {ObjectIndependentView, ViewController, isStringSpec} from '../../../../core';

const START_TIME = 'start';
const END_TIME = 'end';

export const TimeRangeSelectorView: ObjectIndependentView = ({
    value,
    spec,
    name,
    Layout,
    ...restProps
}) => {
    const {startTimeSpec, endTimeSpec} = React.useMemo(() => {
        let startTimeSpec, endTimeSpec;

        if (spec.properties?.[START_TIME] && isStringSpec(spec.properties[START_TIME])) {
            const _spec = cloneDeep(spec.properties[START_TIME]);

            _spec.viewSpec.layout = 'row';

            startTimeSpec = _spec;
        }

        if (spec.properties?.[END_TIME] && isStringSpec(spec.properties[END_TIME])) {
            const _spec = cloneDeep(spec.properties[END_TIME]);

            _spec.viewSpec.layout = 'row';

            endTimeSpec = _spec;
        }

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
