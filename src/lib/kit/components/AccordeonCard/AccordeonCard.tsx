import React from 'react';

import {ChevronDown} from '@gravity-ui/icons';
import {Button, Icon, Text} from '@gravity-ui/uikit';
import _ from 'lodash';

import {block} from '../../utils';

import './AccordeonCard.scss';

const b = block('accordeon-card');

export interface AccordeonCardProps {
    children: React.ReactNode;
    name: string;
    header: React.ReactNode;
    description?: string;
    className?: string;
    open?: boolean;
    onToggle?: (value: boolean) => void;
    headerActionsTemplate?: React.ReactNode;
    ignoreHeaderToggle?: boolean;
    titleSize?: 's' | 'm';
    alwaysOpen?: boolean;
}
export const AccordeonCard: React.FC<AccordeonCardProps> = ({
    className,
    name,
    header,
    description,
    open: propsOpen,
    onToggle,
    headerActionsTemplate,
    ignoreHeaderToggle,
    titleSize = 'm',
    alwaysOpen,
    children,
}) => {
    const accordeonRef = React.useRef<HTMLDivElement>(null);
    const bodyRef = React.useRef<HTMLDivElement>(null);
    const [open, setOpen] = React.useState(alwaysOpen || propsOpen || false);

    const handleToggle = React.useCallback(() => {
        setOpen(!open);
        onToggle?.(!open);
    }, [open, setOpen, onToggle]);

    const preventEvent = React.useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation(),
        [],
    );

    const emptyBody = bodyRef.current && !bodyRef.current.childElementCount;

    React.useEffect(() => {
        if (!alwaysOpen && propsOpen !== undefined && propsOpen !== open) {
            setOpen(propsOpen);
        }
    }, [propsOpen]);

    React.useEffect(() => {
        if (
            bodyRef.current &&
            !bodyRef.current.childElementCount &&
            accordeonRef.current &&
            !accordeonRef.current.className.includes('df-accordeon-card_empty')
        ) {
            accordeonRef.current.classList.add('df-accordeon-card_empty');
        }
    });

    const currentHeaderVariant = React.useMemo(() => {
        if (!_.isString(header)) {
            return 'body-1';
        }
        if (titleSize === 'm') {
            return 'subheader-2';
        }
        return 'subheader-1';
    }, [titleSize]);

    return (
        <div ref={accordeonRef} className={b({empty: Boolean(emptyBody)}, className)}>
            <div
                className={b('header', {
                    open: open && !emptyBody,
                    'without-action': ignoreHeaderToggle || alwaysOpen,
                })}
                onClick={!ignoreHeaderToggle && !alwaysOpen ? handleToggle : undefined}
            >
                <div className={b('header-content')}>
                    <Text variant={currentHeaderVariant}>{header}</Text>
                    {description ? (
                        <span
                            className={b('header-content-description')}
                            dangerouslySetInnerHTML={{__html: description}}
                        />
                    ) : null}
                </div>
                {!emptyBody && !alwaysOpen ? (
                    <div className={b('header-toggle-btn')} onClick={preventEvent}>
                        {headerActionsTemplate ? (
                            <div className={b('interal-actions')}>{headerActionsTemplate}</div>
                        ) : null}
                        <Button view="flat" onClick={handleToggle} qa={`${name}-accordeon-toggler`}>
                            <Icon
                                className={b('toggle-icon', {open})}
                                data={ChevronDown}
                                size={16}
                            />
                        </Button>
                    </div>
                ) : null}
            </div>
            <div ref={bodyRef} className={b('body', {open: open && !emptyBody})}>
                {children}
            </div>
        </div>
    );
};
