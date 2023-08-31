import React from 'react';

import {HelpPopover} from '@gravity-ui/components';
import {Card, Text} from '@gravity-ui/uikit';

import {block} from '../../utils';

import './TogglerCard.scss';

const b = block('toggler-card');

interface TogglerCardProps {
    description?: string;
    title: string;
    text: string;
    onClick: () => void;
    disabled?: boolean;
    selected: boolean;
}

export const TogglerCard: React.FC<TogglerCardProps> = ({
    description,
    title,
    text,
    onClick,
    disabled,
    selected,
}) => {
    return (
        <Card
            onClick={onClick}
            type="selection"
            disabled={disabled ? !selected : disabled}
            selected={selected}
            size="m"
            className={b()}
        >
            <div className={b('header')}>
                <Text variant="subheader-2" ellipsis>
                    {title}
                </Text>
                {description ? (
                    <HelpPopover htmlContent={description} placement={['bottom', 'top']} />
                ) : null}
            </div>
            <Text variant="body-1" color="secondary" className={b('text')}>
                {text}
            </Text>
        </Card>
    );
};
