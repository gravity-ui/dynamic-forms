import React from 'react';

import isBoolean from 'lodash/isBoolean';

import {ArrayViewLayoutProps, ObjectViewLayoutProps, useDynamicFormsCtx} from '../../../../core';
import {isNotEmptyValue} from '../../../utils';
import {SimpleVerticalAccordeon} from '../../SimpleVerticalAccordeon';

export const ViewAccordeon = <T extends ArrayViewLayoutProps | ObjectViewLayoutProps>({
    name,
    value,
    spec,
    children,
}: T): JSX.Element | null => {
    const {showLayoutDescription} = useDynamicFormsCtx();
    const [open, setOpen] = React.useState(
        isBoolean(spec.viewSpec.layoutOpen) ? spec.viewSpec.layoutOpen : true,
    );

    if (!isNotEmptyValue(value, spec)) {
        return null;
    }

    return (
        <SimpleVerticalAccordeon
            name={name}
            title={spec.viewSpec.layoutTitle || ''}
            note={
                showLayoutDescription && spec.viewSpec.layoutDescription
                    ? spec.viewSpec.layoutDescription
                    : undefined
            }
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
