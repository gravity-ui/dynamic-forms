import React from 'react';

import {HelpPopover} from '@gravity-ui/components';
import {ChevronDown} from '@gravity-ui/icons';
import {Button, Icon, Popover, Text} from '@gravity-ui/uikit';

import {COMMON_POPOVER_PLACEMENT} from '../../constants/common';
import {block} from '../../utils';

import './SimpleVerticalAccordeon.scss';

const b = block('simple-vertical-accordeon');

interface SimpleVerticalAccordeonProps {
    children: React.ReactNode;
    name: string;
    title: string;
    titleSize?: 's' | 'm' | 'l';
    note?: string;
    openTitle?: string;
    open: boolean;
    headerActionsTemplate?: React.ReactNode;
    className?: string;
    contentClassName?: string;
    buttonClassName?: string;
    onOpenChange?: (open: boolean) => void;
    hideInsteadOfDestroy?: boolean;
    withBranchView?: boolean;
    viewLayout?: boolean;
}

interface SimpleVerticalAccordeonState {
    open: boolean;
    hidden: boolean;
    isFirstRender: boolean;
}

const TITLE_TEXT_MAX_WIDTH = 485; /** 533px (COMMON_TITLE_MAX_WIDTH) - 48px of padding */

export class SimpleVerticalAccordeon extends React.Component<
    SimpleVerticalAccordeonProps,
    SimpleVerticalAccordeonState
> {
    static defaultProps = {
        titleSize: 's',
        open: false,
        withBranchView: false,
    };

    componentRef = React.createRef<HTMLDivElement>();
    titleRef = React.createRef<HTMLElement>();

    constructor(props: SimpleVerticalAccordeonProps) {
        super(props);
        this.state = {open: props.open, hidden: true, isFirstRender: true};
    }

    componentDidUpdate(prevProps: Readonly<SimpleVerticalAccordeonProps>) {
        const {open} = this.props;

        if (prevProps.open !== open) {
            this.setState({open});
        }

        this.checkVisibility();
    }

    componentDidMount() {
        this.setState({isFirstRender: false});
        this.checkVisibility();
    }

    render() {
        const {
            children,
            headerActionsTemplate,
            className,
            contentClassName,
            buttonClassName,
            hideInsteadOfDestroy,
            withBranchView,
            viewLayout,
            name,
        } = this.props;
        const {open, hidden, isFirstRender} = this.state;

        const content = hideInsteadOfDestroy ? (
            <div ref={this.componentRef} className={b('body', {hidden: !open})}>
                {children}
            </div>
        ) : (
            open && (
                <div ref={this.componentRef} className={b('body', contentClassName)}>
                    {children}
                </div>
            )
        );

        if (viewLayout && !isFirstRender && hidden) {
            return null;
        }

        const title = this.getTitle();
        const titlePopoverDisabled =
            (this.titleRef.current?.offsetWidth || 0) <= TITLE_TEXT_MAX_WIDTH;

        const currentTitleVariant = this.getCurrentTitleVariant();

        return (
            Boolean(React.Children.count(children)) && (
                <div className={b({branch: withBranchView, view: viewLayout}, className)}>
                    <div className={b('header')}>
                        <Popover
                            content={title}
                            disabled={titlePopoverDisabled}
                            placement={COMMON_POPOVER_PLACEMENT}
                        >
                            <Button
                                view="flat"
                                className={b('header-inner', buttonClassName)}
                                onClick={this.handleClick}
                                qa={`${name}-accordeon-toggler`}
                                width="auto"
                            >
                                <Text variant={currentTitleVariant}>{title}</Text>
                                <Icon
                                    data={ChevronDown}
                                    className={b('chevron', {open})}
                                    size={16}
                                />
                            </Button>
                        </Popover>

                        {this.getTooltip()}
                        {headerActionsTemplate ? headerActionsTemplate : null}
                    </div>

                    {content}
                </div>
            )
        );
    }

    checkVisibility = () => {
        if (this.props.viewLayout) {
            if (
                this.componentRef.current &&
                this.componentRef.current.children.length &&
                this.state.hidden
            ) {
                this.setState({hidden: false});
            } else if (
                this.componentRef.current &&
                !this.componentRef.current.children.length &&
                !this.state.hidden
            ) {
                this.setState({hidden: true});
            }
        }
    };

    private handleClick = () => {
        const {onOpenChange} = this.props;
        const open = !this.state.open;

        this.setState({open});
        if (onOpenChange) {
            onOpenChange(open);
        }
    };

    private getTitle() {
        const {openTitle, title} = this.props;

        if (!openTitle) {
            return title;
        }
        return this.state.open ? openTitle : title;
    }

    private getCurrentTitleVariant() {
        const {titleSize} = this.props;

        if (titleSize === 'm') {
            return 'body-2';
        }

        if (titleSize === 'l') {
            return 'body-3';
        }

        return 'body-1';
    }

    private getTooltip() {
        const {note} = this.props;

        return note ? (
            <Text className={b('tooltip')}>
                <HelpPopover htmlContent={note} placement={['bottom', 'top']} />
            </Text>
        ) : null;
    }
}
