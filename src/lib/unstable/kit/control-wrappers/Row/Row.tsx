import React from 'react';

import {Flex, HelpMark, Text} from '@gravity-ui/uikit';

import type {ControlWrapper, JsonSchema} from '../../../core';
import {ArrayRemoveButton, ControlError, HTMLContent, WrapperContainer} from '../../components';
import {block, getValidationState} from '../../utils';

import './Row.scss';

const b = block('row');

export interface RowProps {
    descriptionType?: 'tooltip' | 'bottom';
}

const Component: ControlWrapper<JsonSchema, RowProps> = ({
    children,
    input,
    meta,
    schema,
    controlWrapperProps,
}) => {
    const tooltip = React.useMemo(() => {
        if (!schema.description || controlWrapperProps.descriptionType === 'bottom') {
            return null;
        }

        return (
            <HelpMark className={b('help-mark')}>
                <HTMLContent html={schema.description} />
            </HelpMark>
        );
    }, [schema.description, controlWrapperProps.descriptionType]);

    const bottomDescription = React.useMemo(() => {
        if (!schema.description || controlWrapperProps.descriptionType !== 'bottom') {
            return null;
        }

        return <HTMLContent html={schema.description} color="secondary" />;
    }, [schema.description, controlWrapperProps.descriptionType]);

    return (
        <WrapperContainer className={b()} direction="row" alignItems="flex-start" gap={2}>
            <div className={b('left')}>
                <Text
                    className={b('title', {required: controlWrapperProps.required})}
                    wordBreak="break-word"
                >
                    {schema.title}
                </Text>
                {tooltip}
            </div>
            <Flex className={b('right')} direction="column" gap={0.5} grow={1}>
                <Flex grow={1} gap={2}>
                    {children}
                    <ArrayRemoveButton name={input.name} />
                </Flex>
                {bottomDescription}
                <ControlError
                    errorMessage={meta.error}
                    validationState={getValidationState(meta)}
                />
            </Flex>
        </WrapperContainer>
    );
};

export const Row = React.memo(Component);
