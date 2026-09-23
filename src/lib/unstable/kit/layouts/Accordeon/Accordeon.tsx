import React from 'react';

import {ChevronDown, ChevronUp} from '@gravity-ui/icons';
import {
    Button,
    type ButtonProps,
    Disclosure,
    type DisclosureProps,
    Flex,
    Icon,
    type TextProps,
} from '@gravity-ui/uikit';

import {
    type JsonSchema,
    type NodeLayout,
    SchemaRendererMode,
    useSchemaRendererNodeContext,
} from '../../../core';
import {
    EntityDescription,
    EntityError,
    EntityTitle,
    LayoutButtons,
    LayoutContainer,
} from '../../components';
import {useExpanded} from '../../hooks';
import {block} from '../../utils';

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
    mode,
    schema,
    props,
}) => {
    const {settings} = useSchemaRendererNodeContext();

    const {
        titleProps,
        togglerProps,
        withIndent = false,
        withDefaultSummary = true,
        ...restLayoutProps
    } = props;
    const {hidden, open} = schema.nodeParameters?.flags || {};
    const {expanded, setExpanded} = useExpanded({headName, name: input.name, open});

    const overviewFlag = mode === SchemaRendererMode.Overview;

    const summary = React.useMemo(() => <EntityTitle {...titleProps} />, [titleProps]);

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
                        <Flex alignItems="center" gap={2}>
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
                            <EntityDescription likeHelpMark />
                            <LayoutButtons />
                        </Flex>
                    )}
                </Disclosure.Summary>
                <Flex direction="column" gap={0.5} grow={1}>
                    <div className={b('content', {'with-indent': withIndent})}>{children}</div>
                    {overviewFlag ? null : <EntityError />}
                </Flex>
            </Disclosure>
        </LayoutContainer>
    );
};
