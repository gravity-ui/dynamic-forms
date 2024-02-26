import React from 'react';

import isBoolean from 'lodash/isBoolean';

import {Card} from '../';
import {ArrayViewLayoutProps, ObjectViewLayoutProps} from '../../../core';
import {isNotEmptyValue} from '../../utils';

export const ViewCardAccordeon = <T extends ArrayViewLayoutProps | ObjectViewLayoutProps>({
    name,
    value,
    spec,
    children,
}: T): JSX.Element | null => {
    const [open, setOpen] = React.useState(
        isBoolean(spec.viewSpec.layoutOpen) ? spec.viewSpec.layoutOpen : true,
    );

    const onToggle = React.useCallback(() => setOpen((f) => !f), [setOpen]);

    if (!isNotEmptyValue(value, spec)) {
        return null;
    }

    return (
        <Card
            name={name}
            title={spec.viewSpec.layoutTitle}
            open={open}
            onToggle={onToggle}
            checkEmptyBody
        >
            {children}
        </Card>
    );
};
