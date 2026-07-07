import React from 'react';

import {ChevronDown, ChevronUp} from '@gravity-ui/icons';
import {
    Button,
    type ButtonProps,
    Disclosure,
    type DisclosureProps,
    Flex,
    HelpMark,
    Icon,
    Text,
    type TextProps,
} from '@gravity-ui/uikit';

import type {JsonSchema, Wrapper} from '../../../core';
import {ArrayRemoveButton, HTMLContent} from '../../components';
import {block} from '../../utils';

import './Accordeon.scss';

const b = block('accordeon');

export interface AccordeonProps extends DisclosureProps {
    titleProps?: TextProps;
    togglerProps?: ButtonProps;
    withDefaultSummary?: boolean;
    withIndent?: boolean;
}

const Component: Wrapper<JsonSchema, AccordeonProps> = ({
    children,
    input,
    schema,
    wrapperProps,
}) => {
    const {
        withIndent = false,
        withDefaultSummary = false,
        titleProps,
        togglerProps,
        ...restWrapperProps
    } = wrapperProps;

    const summary = React.useMemo(() => {
        const stopPropagation = (event: React.MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation();
        };

        return (
            <Flex alignItems="center" gap={2}>
                {withDefaultSummary ? (
                    <Text {...titleProps}>{schema.title}</Text>
                ) : (
                    <Disclosure.Summary>
                        {(props) => (
                            <Button
                                {...togglerProps}
                                className={b('toggler', togglerProps?.className)}
                            >
                                <Flex alignItems="center" gap={2} height="100%">
                                    <Icon data={props.expanded ? ChevronUp : ChevronDown} />
                                    <Text {...titleProps}>{schema.title}</Text>
                                </Flex>
                            </Button>
                        )}
                    </Disclosure.Summary>
                )}
                {schema.description ? (
                    <HelpMark onClick={stopPropagation}>
                        <HTMLContent html={schema.description} />
                    </HelpMark>
                ) : null}
                <ArrayRemoveButton name={input.name} onClick={stopPropagation} />
            </Flex>
        );
    }, [
        input.name,
        schema.title,
        schema.description,
        titleProps,
        togglerProps,
        withDefaultSummary,
    ]);

    return (
        <Disclosure
            summary={summary}
            defaultExpanded
            {...restWrapperProps}
            className={b({'without-default-summary': !withDefaultSummary}, wrapperProps.className)}
        >
            <div className={b('content', {'with-indent': withIndent})}>{children}</div>
        </Disclosure>
    );
};

export const Accordeon = React.memo(Component);
