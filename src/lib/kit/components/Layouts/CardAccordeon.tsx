import React from 'react';

import {FieldValue, LayoutProps, Spec} from '../../../core';
import {Card, ErrorWrapper} from '../../components';
import {useErrorChecker} from '../../hooks';

import {RemoveButton} from './Accordeon/RemoveButton';

export const CardAccordeon = <T extends FieldValue, S extends Spec>({
    name,
    spec,
    input,
    meta,
    children,
}: LayoutProps<T, S>) => {
    const [open, setOpen] = React.useState(Boolean(spec.viewSpec?.layoutOpen));

    const onToggle = React.useCallback(() => setOpen((f) => !f), [setOpen]);

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
        <Card
            title={spec.viewSpec.layoutTitle}
            description={spec.viewSpec.layoutDescription}
            actions={removeButton}
            open={open}
            onToggle={onToggle}
        >
            <ErrorWrapper name={name} meta={meta} withoutChildErrorStyles>
                {children}
            </ErrorWrapper>
        </Card>
    );
};
