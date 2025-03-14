import React from 'react';

import type {TextProps} from '@gravity-ui/uikit';

import type {ArrayLayoutProps, ObjectLayoutProps} from '../../../../core';
import {isArrayItem} from '../../../../core';
import {useRenderHtml} from '../../../../core/components/Form/hooks/useRenderHtml';
import {ErrorWrapper} from '../../../components';
import {useErrorChecker} from '../../../hooks';
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
}: T): JSX.Element => {
    const {variantTitle} = spec.viewSpec.layoutProps || {};
    const renderHtml = useRenderHtml();

    const [open, setOpen] = React.useState(Boolean(spec.viewSpec?.layoutOpen));

    const onDrop = React.useCallback(() => {
        setOpen(false);
        input.onDrop();
    }, [input.onDrop, setOpen]);

    const removeButton = React.useMemo(() => {
        if (!isArrayItem(name) && (spec.required || !input.value)) {
            return null;
        }

        return <RemoveButton name={name} onDrop={onDrop} />;
    }, [spec.required, input.value, onDrop, name]);

    /* const note = React.useMemo(() => {
        if (!spec.viewSpec.layoutDescription) {
            return '';
        }

        return renderHtml
            ? renderHtml(spec.viewSpec.layoutDescription)
            : spec.viewSpec.layoutDescription;
    }, [spec.viewSpec.layoutDescription, renderHtml]);
 */
    useErrorChecker({name, meta, open, setOpen});

    return (
        <SimpleVerticalAccordeon
            name={name}
            title={spec.viewSpec.layoutTitle || ''}
            note={spec.viewSpec.layoutDescription || ''}
            open={open}
            onOpenChange={setOpen}
            headerActionsTemplate={removeButton}
            hideInsteadOfDestroy
            withBranchView
            variantTitle={variantTitle}
            renderHtml={renderHtml}
        >
            <ErrorWrapper name={name} meta={meta} withoutChildErrorStyles>
                {children}
            </ErrorWrapper>
        </SimpleVerticalAccordeon>
    );
};
