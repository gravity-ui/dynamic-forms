import React from 'react';

import {Flex, HelpMark, Text} from '@gravity-ui/uikit';

import type {JsonSchema, NodeLayout} from '../../../core';
import {ArrayRemoveButton, EntityError, HTMLContent, LayoutContainer} from '../../components';
import {block, getValidationState} from '../../utils';

import './ColumnRow.scss';

const b = block('column-row');

export interface ColumnRowProps {
    descriptionType?: 'tooltip' | 'bottom';
}

const Component: NodeLayout<JsonSchema, ColumnRowProps> = ({
    children,
    headName,
    input,
    meta,
    schema,
    props,
}) => {
    const tooltip = React.useMemo(() => {
        if (!schema.description || props.descriptionType === 'bottom') {
            return null;
        }

        return (
            <HelpMark className={b('help-mark')}>
                <HTMLContent html={schema.description} />
            </HelpMark>
        );
    }, [schema.description, props.descriptionType]);

    const bottomDescription = React.useMemo(() => {
        if (!schema.description || props.descriptionType !== 'bottom') {
            return null;
        }

        return <HTMLContent html={schema.description} color="secondary" />;
    }, [schema.description, props.descriptionType]);

    return (
        <LayoutContainer className={b()} gap={2}>
            <Flex direction="column" gap={0.5} grow={1}>
                <div className={b('top')}>
                    <Text className={b('title', {required: props.required})} wordBreak="break-word">
                        {schema.title}
                    </Text>
                    {tooltip}
                    <ArrayRemoveButton name={input.name} headName={headName} />
                </div>
                {bottomDescription}
            </Flex>
            <Flex className={b('bottom')} direction="column" gap={0.5} grow={1}>
                {children}
                <EntityError errorMessage={meta.error} validationState={getValidationState(meta)} />
            </Flex>
        </LayoutContainer>
    );
};

export const ColumnRow = React.memo(Component);
