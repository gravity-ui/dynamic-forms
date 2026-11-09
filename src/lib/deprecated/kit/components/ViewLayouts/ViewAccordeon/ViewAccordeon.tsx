import React from 'react';

import type {TextProps} from '@gravity-ui/uikit';
import isBoolean from 'lodash/isBoolean';

import type {ArrayValue, ObjectValue, Spec, ViewLayoutProps} from '../../../../core';
import {useDynamicFormsCtx} from '../../../../core';
import {isNotEmptyValue} from '../../../utils';
import {SimpleVerticalAccordeon} from '../../SimpleVerticalAccordeon';

interface ViewAccordeonLayoutProps {
    variantTitle?: TextProps['variant'];
}

export const ViewAccordeon = <
    T extends ViewLayoutProps<ArrayValue | ObjectValue, Spec<any, any, ViewAccordeonLayoutProps>>,
>({
    name,
    value,
    spec,
    children,
}: T): React.JSX.Element | null => {
    const {showLayoutDescription} = useDynamicFormsCtx();
    const [open, setOpen] = React.useState(
        isBoolean(spec.viewSpec.layoutOpen) ? spec.viewSpec.layoutOpen : true,
    );

    const {variantTitle} = spec.viewSpec.layoutProps || {};

    if (!isNotEmptyValue(value, spec as Spec)) {
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
            variantTitle={variantTitle}
        >
            {children}
        </SimpleVerticalAccordeon>
    );
};
