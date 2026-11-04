import React from 'react';

import type {TextProps} from '@gravity-ui/uikit';

import type {ArrayLayoutProps, ObjectLayoutProps} from '../../../../core';
import {isArrayItem} from '../../../../core';
import {ErrorWrapper} from '../../../components';
import {useErrorChecker} from '../../../hooks';
import {getQaBase} from '../../../utils/qa';
import {RemoveButton} from '../../RemoveButton';
import {SimpleVerticalAccordeon} from '../../SimpleVerticalAccordeon';

interface AccordeonLayoutProps {
    variantTitle?: TextProps['variant'];
}

export const Accordeon = <
    T extends
        | ArrayLayoutProps<Record<string, any> | undefined, AccordeonLayoutProps | undefined>
        | ObjectLayoutProps<Record<string, any> | undefined, AccordeonLayoutProps | undefined>,
>({
    name,
    spec,
    input,
    meta,
    children,
}: T): React.JSX.Element => {
    const qaBase = getQaBase(name, spec);
    const {variantTitle} = spec.viewSpec.layoutProps || {};

    const [open, setOpen] = React.useState(Boolean(spec.viewSpec?.layoutOpen));

    const onDrop = React.useCallback(() => {
        setOpen(false);
        input.onDrop();
    }, [input.onDrop, setOpen]);

    const removeButton = React.useMemo(() => {
        if (!isArrayItem(name) && (spec.required || !input.value)) {
            return null;
        }

        return <RemoveButton name={qaBase} onDrop={onDrop} />;
    }, [spec.required, input.value, onDrop, name, qaBase]);

    useErrorChecker({name, meta, open, setOpen});

    return (
        <SimpleVerticalAccordeon
            name={qaBase}
            title={spec.viewSpec.layoutTitle || ''}
            note={spec.viewSpec.layoutDescription || ''}
            open={open}
            onOpenChange={setOpen}
            headerActionsTemplate={removeButton}
            hideInsteadOfDestroy
            withBranchView
            variantTitle={variantTitle}
        >
            <ErrorWrapper name={name} meta={meta} withoutChildErrorStyles>
                {children}
            </ErrorWrapper>
        </SimpleVerticalAccordeon>
    );
};
