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
import {EntityError, HTMLContent, LayoutButtons, LayoutContainer} from '../../components';
import {useExpanded} from '../../hooks';
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
    const {required, hidden, open} = schema.nodeParameters?.flags || {};
    const {expanded, setExpanded} = useExpanded({headName, name: input.name, open});

    const overviewFlag = mode === SchemaRendererMode.Overview;

    const summary = React.useMemo(
        () => (
            <Text
                variant="subheader-1"
                color="complementary"
                {...titleProps}
                className={b('title', {required: required && !overviewFlag}, titleProps?.className)}
                whiteSpace="break-spaces"
                wordBreak="break-word"
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

    return (
        <LayoutContainer
            className={b({'without-default-summary': !withDefaultSummary})}
            hideEmpty={overviewFlag}
            hidden={hidden}
        >
            <Disclosure
                summary={summary}
                expanded={expanded}
                onUpdate={setExpanded}
                {...restLayoutProps}
            >
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
                            <LayoutButtons
                                mode={mode}
                                name={input.name}
                                headName={headName}
                                schema={schema}
                                value={input.value}
                            />
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
