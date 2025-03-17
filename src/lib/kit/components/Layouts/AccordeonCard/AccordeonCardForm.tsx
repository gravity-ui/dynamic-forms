import React from 'react';

import type {ArrayLayoutProps, ObjectLayoutProps} from '../../../../core';
import {isArrayItem} from '../../../../core';
import {useErrorChecker} from '../../../hooks';
import {block} from '../../../utils';
import {AccordeonCard} from '../../AccordeonCard';
import {ErrorWrapper} from '../../ErrorWrapper';
import {RemoveButton} from '../../RemoveButton';

import './AccordeonCardForm.scss';

const b = block('accordeon-card-form');

export const AccordeonCardForm = <T extends ArrayLayoutProps | ObjectLayoutProps>({
    name,
    spec,
    input,
    children,
    meta,
}: T): JSX.Element => {
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

    useErrorChecker({name, meta, open, setOpen});

    return (
        <AccordeonCard
            classNameBody={b('accordeon-card-body')}
            name={name}
            header={spec.viewSpec.layoutTitle || ''}
            description={spec.viewSpec.layoutDescription || ''}
            open={open}
            onToggle={setOpen}
            headerActionsTemplate={removeButton}
        >
            <ErrorWrapper name={name} meta={meta} withoutChildErrorStyles>
                {children}
            </ErrorWrapper>
        </AccordeonCard>
    );
};
