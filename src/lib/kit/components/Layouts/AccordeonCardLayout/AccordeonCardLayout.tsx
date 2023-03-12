import React from 'react';

import {AccordeonCard} from '../../';
import {ArrayLayoutProps, ObjectLayoutProps} from '../../../../core';
import {ErrorWrapper} from '../../../components';
import {useErrorChecker} from '../../../hooks';
import {block} from '../../../utils';
import {RemoveButton} from '../Accordeon/RemoveButton';

import './AccordeonCardLayout.scss';

const b = block('accordeon-card-layout');

export const AccordeonCardLayout = <T extends ArrayLayoutProps | ObjectLayoutProps>({
    name,
    spec,
    input,
    meta,
    children,
}: T): JSX.Element => {
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
        <AccordeonCard
            header={spec.viewSpec.layoutTitle || ''}
            description={spec.viewSpec.layoutDescription || ''}
            open={open}
            onToggle={onToggle}
            headerActionsTemplate={removeButton}
            className={b()}
        >
            <ErrorWrapper name={name} meta={meta} withoutChildErrorStyles>
                {children}
            </ErrorWrapper>
        </AccordeonCard>
    );
};
