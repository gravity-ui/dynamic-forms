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

import {type JsonSchema, type NodeLayout, SchemaRendererMode} from '../../../core';
import {
    ArrayRemoveButton,
    CopyButton,
    EntityError,
    HTMLContent,
    LayoutContainer,
} from '../../components';
import {block, getValidationState} from '../../utils';

import './Accordeon.scss';

const b = block('accordeon');

export interface AccordeonProps extends DisclosureProps {
    titleProps?: TextProps;
    togglerProps?: ButtonProps;
    withDefaultSummary?: boolean;
    withIndent?: boolean;
}

export const Accordeon: NodeLayout<JsonSchema, AccordeonProps> = ({
    children,
    headName,
    input,
    meta,
    mode,
    schema,
    props,
}) => {
    const {
        copy,
        titleProps,
        togglerProps,
        withIndent = false,
        withDefaultSummary = false,
        ...restLayoutProps
    } = props;

    const overviewFlag = mode === SchemaRendererMode.Overview;

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
                {overviewFlag ? (
                    <CopyButton className={b('copy-button')} copy={copy} value={input.value} />
                ) : null}
                {overviewFlag ? null : (
                    <ArrayRemoveButton
                        name={input.name}
                        headName={headName}
                        onClick={stopPropagation}
                    />
                )}
            </Flex>
        );
    }, [
        copy,
        headName,
        input.name,
        input.value,
        overviewFlag,
        schema.title,
        schema.description,
        titleProps,
        togglerProps,
        withDefaultSummary,
    ]);

    return (
        <LayoutContainer
            className={b({'without-default-summary': !withDefaultSummary})}
            hideEmpty={overviewFlag}
        >
            <Disclosure summary={summary} defaultExpanded {...restLayoutProps}>
                <Flex direction="column" gap={0.5} grow={1}>
                    <div className={b('content', {'with-indent': withIndent})}>{children}</div>
                    {overviewFlag ? null : (
                        <EntityError
                            errorMessage={meta.error}
                            validationState={getValidationState(meta)}
                        />
                    )}
                </Flex>
            </Disclosure>
        </LayoutContainer>
    );
};
