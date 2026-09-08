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
        titleProps,
        togglerProps,
        withIndent = false,
        withDefaultSummary = false,
        ...restLayoutProps
    } = props;
    const {copy, required, hidden, open} = schema.nodeParameters?.flags || {};

    const overviewFlag = mode === SchemaRendererMode.Overview;

    const summary = React.useMemo(
        () => (
            <Text
                {...titleProps}
                className={b('title', {required: required && !overviewFlag}, titleProps?.className)}
            >
                {schema.title}
            </Text>
        ),
        [overviewFlag, required, schema.title, titleProps],
    );

    const helpMark = React.useMemo(() => {
        if (schema.description) {
            return (
                <HelpMark>
                    <HTMLContent content={schema.description} headName={headName} />
                </HelpMark>
            );
        }

        return null;
    }, [schema.description, headName]);

    const copyButton = React.useMemo(() => {
        if (overviewFlag) {
            return <CopyButton className={b('copy-button')} copy={copy} value={input.value} />;
        }

        return null;
    }, [overviewFlag, copy, input.value]);

    const removeButton = React.useMemo(() => {
        if (overviewFlag) {
            return null;
        }

        return <ArrayRemoveButton name={input.name} headName={headName} />;
    }, [overviewFlag, input.name, headName]);

    return (
        <LayoutContainer
            className={b({'without-default-summary': !withDefaultSummary})}
            hideEmpty={overviewFlag}
            hidden={hidden}
        >
            <Disclosure defaultExpanded={open} summary={summary} {...restLayoutProps}>
                <Disclosure.Summary>
                    {({expanded, onClick}, defaultSummary) => (
                        <Flex minHeight="28px" alignItems="center" gap={2}>
                            {withDefaultSummary ? (
                                defaultSummary
                            ) : (
                                <Button
                                    {...togglerProps}
                                    onClick={onClick}
                                    className={b('toggler', togglerProps?.className)}
                                >
                                    <Flex alignItems="center" gap={2} height="100%">
                                        <Icon data={expanded ? ChevronUp : ChevronDown} />
                                        {summary}
                                    </Flex>
                                </Button>
                            )}
                            {helpMark}
                            {copyButton}
                            {removeButton}
                        </Flex>
                    )}
                </Disclosure.Summary>
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
