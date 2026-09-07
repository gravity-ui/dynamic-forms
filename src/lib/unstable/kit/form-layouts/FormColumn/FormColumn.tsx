import React from 'react';

import {Flex, HelpMark, Text} from '@gravity-ui/uikit';

import type {JsonSchema, NodeLayout} from '../../../core';
import {ArrayRemoveButton, EntityError, HTMLContent, LayoutContainer} from '../../components';
import {block, getValidationState} from '../../utils';

import './FormColumn.scss';

const b = block('form-column');

export interface FormColumnProps {
    descriptionType?: 'tooltip' | 'bottom';
}

export const FormColumn: NodeLayout<JsonSchema, FormColumnProps> = ({
    children,
    headName,
    input,
    meta,
    schema,
    props,
}) => {
    const {hidden, required} = schema.nodeParameters?.flags || {};

    const tooltip = React.useMemo(() => {
        if (!schema.description || props.descriptionType === 'bottom') {
            return null;
        }

        return (
            <HelpMark className={b('help-mark')}>
                <HTMLContent content={schema.description} headName={headName} />
            </HelpMark>
        );
    }, [headName, schema.description, props.descriptionType]);

    const bottomDescription = React.useMemo(() => {
        if (!schema.description || props.descriptionType !== 'bottom') {
            return null;
        }

        return <HTMLContent content={schema.description} headName={headName} color="secondary" />;
    }, [headName, schema.description, props.descriptionType]);

    return (
        <LayoutContainer className={b()} gap={2} hidden={hidden}>
            <Flex direction="column" gap={0.5}>
                <div className={b('top')}>
                    <Text className={b('title', {required})} wordBreak="break-word">
                        {schema.title}
                    </Text>
                    {tooltip}
                    <ArrayRemoveButton name={input.name} headName={headName} />
                </div>
                {bottomDescription}
            </Flex>
            <Flex className={b('bottom')} direction="column" gap={0.5}>
                {children}
                <EntityError errorMessage={meta.error} validationState={getValidationState(meta)} />
            </Flex>
        </LayoutContainer>
    );
};
