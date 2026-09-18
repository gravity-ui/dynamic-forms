import React from 'react';

import {ChevronDown, ChevronUp} from '@gravity-ui/icons';
import {
    Button,
    type ButtonProps,
    Disclosure,
    type DisclosureProps,
    Flex,
    Icon,
    Text,
    type TextProps,
} from '@gravity-ui/uikit';

import {type JsonSchema, type NodeLayout, SchemaRendererMode} from '../../../core';
import {EntityError, HelpMark, LayoutButtons, LayoutContainer} from '../../components';
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
    settings,
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
                variant={settings?.titleVariant}
                color="complementary"
                {...titleProps}
                className={b('title', {required: required && !overviewFlag}, titleProps?.className)}
                whiteSpace="break-spaces"
                wordBreak="break-word"
            >
                {schema.title}
            </Text>
        ),
        [overviewFlag, required, schema.title, titleProps, settings?.titleVariant],
    );

    const helpMark = React.useMemo(() => {
        if (schema.description) {
            return (
                <HelpMark settings={settings} content={schema.description} headName={headName} />
            );
        }
        return null;
    }, [schema.description, headName, settings]);
    return (
        <LayoutContainer
            className={b({
                'without-default-summary': !withDefaultSummary,
                size: settings?.size,
            })}
            hideEmpty={overviewFlag}
            hidden={hidden}
        >
            <Disclosure
                size={settings?.size === 's' ? 'm' : settings?.size}
                summary={summary}
                expanded={expanded}
                onUpdate={setExpanded}
                {...restLayoutProps}
            >
                <Disclosure.Summary>
                    {({expanded, onClick}, defaultSummary) => (
                        <Flex minHeight="var(--size)" alignItems="center" gap={2}>
                            {withDefaultSummary ? (
                                defaultSummary
                            ) : (
                                <Button
                                    size={settings?.size}
                                    {...togglerProps}
                                    onClick={onClick}
                                    className={b('toggler', togglerProps?.className)}
                                >
                                    <div className={b('toggler-content')}>
                                        <Icon data={expanded ? ChevronUp : ChevronDown} />
                                        {summary}
                                    </div>
                                </Button>
                            )}
                            {helpMark}
                            <LayoutButtons
                                mode={mode}
                                name={input.name}
                                headName={headName}
                                schema={schema}
                                settings={settings}
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
                            settings={settings}
                            validationState={getValidationState(meta)}
                        />
                    )}
                </Flex>
            </Disclosure>
        </LayoutContainer>
    );
};
