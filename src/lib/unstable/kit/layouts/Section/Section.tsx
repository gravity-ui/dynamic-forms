import React from 'react';

import {Flex, HelpMark, Text, type TextProps} from '@gravity-ui/uikit';

import {type JsonSchema, type NodeLayout, SchemaRendererMode} from '../../../core';
import {
    ArrayRemoveButton,
    CopyButton,
    EntityError,
    HTMLContent,
    LayoutContainer,
} from '../../components';
import {block, getValidationState} from '../../utils';

import './Section.scss';

const b = block('section');

export interface SectionProps extends TextProps {
    descriptionType?: 'tooltip' | 'bottom';
    withIndent?: boolean;
}

export const Section: NodeLayout<JsonSchema, SectionProps> = ({
    children,
    headName,
    input,
    meta,
    mode,
    schema,
    props,
}) => {
    const {copy, descriptionType = 'tooltip', withIndent = false, ...restLayoutProps} = props;

    const overviewFlag = mode === SchemaRendererMode.Overview;

    const tooltip = React.useMemo(() => {
        if (!schema.description || descriptionType === 'bottom') {
            return null;
        }

        return (
            <HelpMark>
                <HTMLContent html={schema.description} />
            </HelpMark>
        );
    }, [schema.description, descriptionType]);

    const bottomDescription = React.useMemo(() => {
        if (!schema.description || descriptionType !== 'bottom' || overviewFlag) {
            return null;
        }

        return <HTMLContent html={schema.description} color="secondary" />;
    }, [schema.description, descriptionType, overviewFlag]);

    return (
        <LayoutContainer className={b()} gap={0.5} hideEmpty={overviewFlag}>
            <Flex direction="column" gap={4}>
                <Flex direction="column">
                    <Flex className={b('header')} gap={2} alignItems="center">
                        <Text variant="subheader-1" {...restLayoutProps}>
                            {schema.title}
                        </Text>
                        {tooltip}
                        {overviewFlag ? (
                            <CopyButton
                                className={b('copy-button')}
                                copy={copy}
                                value={input.value}
                            />
                        ) : null}
                        {overviewFlag ? null : (
                            <ArrayRemoveButton name={input.name} headName={headName} />
                        )}
                    </Flex>
                    {bottomDescription}
                </Flex>
                <div className={b('content', {'with-indent': withIndent})}>{children}</div>
            </Flex>
            {overviewFlag ? null : (
                <EntityError errorMessage={meta.error} validationState={getValidationState(meta)} />
            )}
        </LayoutContainer>
    );
};
