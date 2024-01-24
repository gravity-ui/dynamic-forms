import React from 'react';

import {ArrayLayoutProps} from '../../../../core';
import {AccordeonCard} from '../../AccordeonCard';

import {RemoveButton} from './RemoveButton';

interface AccordeonCardProps {
    className?: string;
    ignoreHeaderToggle?: boolean;
    titleSize?: 's' | 'm';
    alwaysOpen?: boolean;
}

export const AccordeonCardLayout = <T extends ArrayLayoutProps & AccordeonCardProps>({
    name,
    spec,
    input,
    children,
    ignoreHeaderToggle,
    titleSize,
    alwaysOpen,
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

    return (
        <AccordeonCard
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
            {children}
        </AccordeonCard>
    );
};
