import React from 'react';

import _ from 'lodash';

import {ArrayViewLayoutProps} from '../../../../core';
import {isNotEmptyValue} from '../../../utils';
import {AccordeonCard} from '../../AccordeonCard';

interface AccordeonCardProps {
    className?: string;
    ignoreHeaderToggle?: boolean;
    titleSize?: 's' | 'm';
    alwaysOpen?: boolean;
}

export const ViewAccordeonCard = <T extends ArrayViewLayoutProps & AccordeonCardProps>({
    value,
    name,
    spec,
    children,
    ignoreHeaderToggle,
    titleSize,
    alwaysOpen,
}: T): JSX.Element | null => {
    const [open, setOpen] = React.useState(
        _.isBoolean(spec.viewSpec.layoutOpen) ? spec.viewSpec.layoutOpen : true,
    );

    if (!isNotEmptyValue(value, spec)) {
        return null;
    }

    return (
        <AccordeonCard
            name={name}
            header={spec.viewSpec.layoutTitle || ''}
            description={spec.viewSpec.layoutDescription || ''}
            open={open}
            onToggle={setOpen}
            alwaysOpen={alwaysOpen}
            titleSize={titleSize}
            ignoreHeaderToggle={ignoreHeaderToggle}
        >
            {children}
        </AccordeonCard>
    );
};
