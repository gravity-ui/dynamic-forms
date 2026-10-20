import React from 'react';

import {Card} from '..';
import type {FormValue, Spec, ViewLayoutProps} from '../../../core';
import {isNotEmptyValue} from '../../utils';

/** @deprecated Use the SchemaRenderer API. */
export const ViewCardSection = <T extends FormValue, S extends Spec>({
    name,
    value,
    spec,
    children,
}: ViewLayoutProps<T, S>) => {
    if (!isNotEmptyValue(value, spec)) {
        return null;
    }

    return (
        <Card name={name} title={spec.viewSpec.layoutTitle} alwaysOpen checkEmptyBody>
            {children}
        </Card>
    );
};
