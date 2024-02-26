import React from 'react';

import isBoolean from 'lodash/isBoolean';

import {ArrayViewLayoutProps, ObjectViewLayoutProps} from '../../../../core';
import {isNotEmptyValue} from '../../../utils';
import {AccordeonCard} from '../../AccordeonCard';

export const ViewAccordeonCard = <T extends ArrayViewLayoutProps | ObjectViewLayoutProps>({
    value,
    name,
    spec,
    children,
}: T): JSX.Element | null => {
    const [open, setOpen] = React.useState(
        isBoolean(spec.viewSpec.layoutOpen) ? spec.viewSpec.layoutOpen : true,
    );

    if (!isNotEmptyValue(value, spec)) {
        return null;
    }

    return (
        <AccordeonCard
            name={name}
            header={spec.viewSpec.layoutTitle || ''}
            open={open}
            onToggle={setOpen}
        >
            {children}
        </AccordeonCard>
    );
};
