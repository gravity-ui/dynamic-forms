import React from 'react';

import {ChevronDown} from '@gravity-ui/icons';
import {Button, Card as CardBase, HelpPopover, Icon} from '@gravity-ui/uikit';
import _ from 'lodash';

import {block} from '../../utils';

import './Card.scss';

const b = block('card');

export interface CardProps {
    children: React.ReactNode;
    name: string;
    title?: string | React.ReactNode;
    description?: string;
    actions?: React.ReactNode;
    open?: boolean;
    onToggle?: (value: boolean) => void;
    alwaysOpen?: boolean;
    disableHeaderToggle?: boolean;
    checkEmptyBody?: boolean;
}

export const Card: React.FC<CardProps> = ({
    name,
    title: propsTitle,
    description,
    actions,
    open: propsOpen,
    onToggle,
    alwaysOpen,
    disableHeaderToggle,
    checkEmptyBody,
    children,
}) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const bodyRef = React.useRef<HTMLDivElement>(null);
    const [open, setOpen] = React.useState(alwaysOpen || propsOpen || false);

    const emptyBody = Boolean(bodyRef.current && !bodyRef.current.childElementCount);

    const handleToggle = React.useMemo(() => {
        if (!alwaysOpen) {
            return () => {
                setOpen(!open);
                onToggle?.(!open);
            };
        }

        return;
    }, [alwaysOpen, open, setOpen, onToggle]);

    const handleHeaderToggle = React.useMemo(() => {
        if (!disableHeaderToggle && handleToggle) {
            return handleToggle;
        }

        return;
    }, [disableHeaderToggle, handleToggle]);

    const preventEvent = React.useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation(),
        [],
    );

    const title = React.useMemo(() => {
        if (_.isString(propsTitle)) {
            return (
                <React.Fragment>
                    <div className={b('title')}>{propsTitle}</div>
                    {description ? (
                        <div className={b('note')}>
                            <HelpPopover htmlContent={description} placement={['bottom', 'top']} />
                        </div>
                    ) : null}
                </React.Fragment>
            );
        }

        return propsTitle;
    }, [propsTitle, description]);

    React.useEffect(() => {
        if (!alwaysOpen && propsOpen !== undefined && propsOpen !== open) {
            setOpen(propsOpen);
        }
    }, [propsOpen]);

    React.useEffect(() => {
        if (
            checkEmptyBody &&
            bodyRef.current &&
            !bodyRef.current.childElementCount &&
            containerRef.current &&
            !containerRef.current.className.includes('df-card_empty-body')
        ) {
            containerRef.current.classList.add('df-card_empty-body');
        }
    });

    return (
        <CardBase
            ref={containerRef}
            className={b({'empty-body': emptyBody})}
            type="container"
            theme="normal"
        >
            <div
                className={b('header', {interactive: Boolean(handleHeaderToggle)})}
                onClick={handleHeaderToggle}
            >
                <div className={b('header-left')}>{title}</div>
                <div className={b('header-right')} onClick={preventEvent}>
                    {actions ? <div className={b('actions')}>{actions}</div> : null}
                    {alwaysOpen ? null : (
                        <div className={b('toggler')}>
                            <Button
                                view="flat"
                                onClick={handleToggle}
                                qa={`${name}-accordeon-toggler`}
                            >
                                <Icon
                                    className={b('toggler-icon', {open})}
                                    data={ChevronDown}
                                    size={16}
                                />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            <div ref={bodyRef} className={b('body', {open})}>
                {children}
            </div>
        </CardBase>
    );
};
