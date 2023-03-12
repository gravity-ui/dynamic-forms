import React from 'react';

import _ from 'lodash';

import {AccordeonCard} from '../../';
import {ArrayViewLayoutProps, ObjectViewLayoutProps} from '../../../../core';
import {isNotEmptyValue} from '../../../utils';

export const ViewAccordeonCard = <T extends ArrayViewLayoutProps | ObjectViewLayoutProps>({
    value,
    spec,
    children,
}: T): JSX.Element | null => {
    const [open, setOpen] = React.useState(true);

    const onToggle = React.useCallback(() => setOpen((f) => !f), [setOpen]);

    if (!isNotEmptyValue(value, spec)) {
        return null;
    }

    return (
        <AccordeonCard
            header={spec.viewSpec.layoutTitle || ''}
            open={open}
            onToggle={onToggle}
            className="df-accordeon-card-layout"
        >
            {children}
        </AccordeonCard>
    );
};
