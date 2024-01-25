import React from 'react';

import {ArrayLayoutProps, ObjectLayoutProps} from '../../../../core';
import {ErrorWrapper} from '../../../components';
import {useErrorChecker} from '../../../hooks';
import {RemoveButton} from '../../RemoveButton';
import {SimpleVerticalAccordeon} from '../../SimpleVerticalAccordeon';

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

        return <RemoveButton name={name} onDrop={onDrop} />;
    }, [spec.required, input.value, onDrop, name]);

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
        >
            <ErrorWrapper name={name} meta={meta} withoutChildErrorStyles>
                {children}
            </ErrorWrapper>
        </SimpleVerticalAccordeon>
    );
};
