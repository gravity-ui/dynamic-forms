import React from 'react';

import {ErrorWrapper} from '../..';
import type {FieldValue, LayoutProps, Spec} from '../../../../core';

export const TableCell = <T extends FieldValue, S extends Spec>({
    name,
    meta,
    children,
}: LayoutProps<T, undefined, undefined, S>) => (
    <ErrorWrapper name={name} meta={meta}>
        {children}
    </ErrorWrapper>
);
