import React from 'react';

import type {FormValue, Spec, ViewLayoutProps} from '../../../core';
import {Card} from '../../components';
import {isNotEmptyValue} from '../../utils';
import {getQaBase} from '../../utils/qa';

export const ViewCardSection = <T extends FormValue, S extends Spec>({
    name,
    value,
    spec,
    children,
}: ViewLayoutProps<T, S>) => {
    const qaBase = getQaBase(name, spec);

    if (!isNotEmptyValue(value, spec)) {
        return null;
    }

    return (
        <Card name={qaBase} title={spec.viewSpec.layoutTitle} alwaysOpen checkEmptyBody>
            {children}
        </Card>
    );
};
