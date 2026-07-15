import React from 'react';

import {Flex, HelpMark, Text} from '@gravity-ui/uikit';

import type {ControlWrapper, JsonSchema} from '../../../core';
import {ArrayRemoveButton, ControlError, HTMLContent, WrapperContainer} from '../../components';
import {block, getValidationState} from '../../utils';

import './ColumnRow.scss';

const b = block('column-row');

export interface ColumnRowProps {
    descriptionType?: 'tooltip' | 'bottom';
}

const Component: ControlWrapper<JsonSchema, ColumnRowProps> = ({
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
        <WrapperContainer className={b()} gap={2}>
            <Flex direction="column" gap={0.5} grow={1}>
                <div className={b('top')}>
                    <Text
                        className={b('title', {required: controlWrapperProps.required})}
                        wordBreak="break-word"
                    >
                        {schema.title}
                    </Text>
                    {tooltip}
                    <ArrayRemoveButton name={input.name} />
                </div>
                {bottomDescription}
            </Flex>
            <Flex className={b('bottom')} direction="column" gap={0.5} grow={1}>
                {children}
                <ControlError
                    errorMessage={meta.error}
                    validationState={getValidationState(meta)}
                />
            </Flex>
        </WrapperContainer>
    );
};

export const ColumnRow = React.memo(Component);
