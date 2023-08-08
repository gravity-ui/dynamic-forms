import React from 'react';

import {HelpPopover} from '@gravity-ui/components';
import {ChevronDown} from '@gravity-ui/icons';
import {Button, Icon} from '@gravity-ui/uikit';

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
            titleSize,
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

        return (
            Boolean(React.Children.count(children)) && (
                <div className={b({branch: withBranchView, view: viewLayout}, className)}>
                    <div className={b('header')}>
                        <Button
                            view="flat"
                            width="auto"
                            className={b('header-inner', buttonClassName)}
                            onClick={this.handleClick}
                            qa={`${name}-accordeon-toggler`}
                        >
                            <b className={b('title', {size: titleSize})}>{this.getTitle()}</b>
                            <Icon data={ChevronDown} className={b('chevron', {open})} size={16} />
                        </Button>
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

    private getTooltip() {
        const {note} = this.props;

        return note ? (
            <span className={b('tooltip')}>
                <HelpPopover htmlContent={note} placement={['bottom', 'top']} />
            </span>
        ) : null;
    }
}
