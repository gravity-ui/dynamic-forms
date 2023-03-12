import React from 'react';

import _ from 'lodash';

import {BooleanViewProps, NumberViewProps, StringSpec, StringViewProps} from '../../../../core';
import {LongValue} from '../../../components';

export const BaseView = <T extends BooleanViewProps | NumberViewProps | StringViewProps>({
    value,
    spec,
    linkValue,
}: React.PropsWithChildren<T>) => {
    if (_.isString(value) && linkValue) {
        return <>{linkValue}</>;
    }

    return (
        <LongValue value={(spec as StringSpec)?.description?.[String(value)] || String(value)} />
    );
};
