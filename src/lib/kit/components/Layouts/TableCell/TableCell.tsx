import React from 'react';

import type {FieldValue, LayoutProps, Spec} from '../../../../core';
import {ErrorWrapper} from '../../../components';

export const TableCell = <T extends FieldValue, S extends Spec>({
    name,
    meta,
    children,
}: LayoutProps<T, undefined, undefined, S>): JSX.Element => (
    <ErrorWrapper name={name} meta={meta}>
        {children}
    </ErrorWrapper>
);
