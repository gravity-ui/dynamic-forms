import React from 'react';

import {Card, HelpMark, Text} from '@gravity-ui/uikit';

import {COMMON_POPOVER_PLACEMENT} from '../../constants/common';
import {block} from '../../utils';
import {HTMLContent} from '../HTMLContent';

import './TogglerCard.scss';

const b = block('toggler-card');

interface TogglerCardProps {
    description?: string;
    title: string;
    text: string;
    onClick: () => void;
    disabled?: boolean;
    selected: boolean;
    renderHtml?: (html: string) => React.ReactNode;
}

export const TogglerCard: React.FC<TogglerCardProps> = ({
    description,
    title,
    text,
    onClick,
    disabled,
    selected,
    renderHtml,
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
                    <HelpMark
                        popoverProps={{
                            placement: COMMON_POPOVER_PLACEMENT,
                        }}
                    >
                        <HTMLContent html={description} />
                    </HelpMark>
                ) : null}
            </div>
            <Text variant="body-1" color="secondary" className={b('text')}>
                {text}
            </Text>
        </Card>
    );
};
