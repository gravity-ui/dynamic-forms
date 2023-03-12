import React from 'react';

import {ArrayLayoutProps, ObjectLayoutProps} from '../../../../core';
import {ErrorWrapper} from '../../../components';
import {useErrorChecker} from '../../../hooks';
import {SimpleVerticalAccordeon} from '../../SimpleVerticalAccordeon';

import {RemoveButton} from './RemoveButton';

export const Accordeon = <T extends ArrayLayoutProps | ObjectLayoutProps>({
    name,
    spec,
    input,
    meta,
    children,
}: T): JSX.Element => {
    const [open, setOpen] = React.useState(Boolean(spec.viewSpec?.layoutOpen));

    const onDrop = React.useCallback(() => {
        setOpen(false);
        input.onDrop();
    }, [input.onDrop, setOpen]);

    const removeButton = React.useMemo(() => {
        if (spec.required || !input.value) {
            return null;
        }

        return <RemoveButton onDrop={onDrop} />;
    }, [spec.required, input.value, onDrop]);

    useErrorChecker({name, meta, open, setOpen});

    return (
        <SimpleVerticalAccordeon
            title={spec.viewSpec.layoutTitle || ''}
            note={spec.viewSpec.layoutDescription || ''}
            open={open}
            onOpenChange={setOpen}
            headerActionsTemplate={removeButton}
            hideInsteadOfDestroy
            withBranchView
        >
            <ErrorWrapper name={name} meta={meta} withoutChildErrorStyles>
                {children}
            </ErrorWrapper>
        </SimpleVerticalAccordeon>
    );
};
