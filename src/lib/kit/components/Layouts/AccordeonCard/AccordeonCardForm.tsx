import React from 'react';

import {ArrayLayoutProps, ObjectLayoutProps} from '../../../../core';
import {useErrorChecker} from '../../../hooks';
import {block} from '../../../utils';
import {AccordeonCard} from '../../AccordeonCard';
import {ErrorWrapper} from '../../ErrorWrapper';
import {RemoveButton} from '../../RemoveButton';

import './AccordeonCardForm.scss';

const b = block('accordeon-card-form');

interface AccordeonCardFormProps {
    className?: string;
    ignoreHeaderToggle?: boolean;
    titleSize?: 's' | 'm';
    alwaysOpen?: boolean;
}

export const AccordeonCardForm = <
    T extends (ArrayLayoutProps | ObjectLayoutProps) & AccordeonCardFormProps,
>({
    name,
    spec,
    input,
    children,
    ignoreHeaderToggle,
    titleSize,
    alwaysOpen,
    meta,
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
        <AccordeonCard
            classNameBody={b('accordeon-card-body')}
            name={name}
            header={spec.viewSpec.layoutTitle || ''}
            description={spec.viewSpec.layoutDescription || ''}
            open={open}
            onToggle={setOpen}
            headerActionsTemplate={removeButton}
            alwaysOpen={alwaysOpen}
            titleSize={titleSize}
            ignoreHeaderToggle={ignoreHeaderToggle}
        >
            <ErrorWrapper name={name} meta={meta} withoutChildErrorStyles>
                {children}
            </ErrorWrapper>
        </AccordeonCard>
    );
};
