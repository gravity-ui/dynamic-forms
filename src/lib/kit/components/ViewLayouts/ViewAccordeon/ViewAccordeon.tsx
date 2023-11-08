import React from 'react';

import _ from 'lodash';

import {ArrayViewLayoutProps, ObjectViewLayoutProps} from '../../../../core';
import {isNotEmptyValue} from '../../../utils';
import {SimpleVerticalAccordeon} from '../../SimpleVerticalAccordeon';

export const ViewAccordeon = <T extends ArrayViewLayoutProps | ObjectViewLayoutProps>({
    name,
    value,
    spec,
    children,
}: T): JSX.Element | null => {
    const [open, setOpen] = React.useState(
        _.isBoolean(spec.viewSpec.layoutOpen) ? spec.viewSpec.layoutOpen : true,
    );

    if (!isNotEmptyValue(value, spec)) {
        return null;
    }

    return (
        <SimpleVerticalAccordeon
            name={name}
            title={spec.viewSpec.layoutTitle || ''}
            open={open}
            onOpenChange={setOpen}
            hideInsteadOfDestroy
            withBranchView
            viewLayout
        >
            {children}
        </SimpleVerticalAccordeon>
    );
};
