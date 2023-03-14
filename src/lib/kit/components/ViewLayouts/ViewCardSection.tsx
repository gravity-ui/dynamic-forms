import React from 'react';

import {FormValue, Spec, ViewLayoutProps} from '../../../core';
import {Card} from '../../components';
import {isNotEmptyValue} from '../../utils';

export const ViewCardSection = <T extends FormValue, S extends Spec>({
    value,
    spec,
    children,
}: ViewLayoutProps<T, S>) => {
    if (!isNotEmptyValue(value, spec)) {
        return null;
    }

    return (
        <Card title={spec.viewSpec.layoutTitle} alwaysOpen checkEmptyBody>
            {children}
        </Card>
    );
};
