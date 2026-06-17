import React from 'react';

import {Flex, HelpMark, Text} from '@gravity-ui/uikit';

import type {JsonSchema, Wrapper} from '../../../core';
import {ArrayRemoveButton, HTMLContent} from '../../components';
import {block} from '../../utils';

import './Row.scss';

const b = block('row');

export interface RowProps {
    descriptionType?: 'tooltip' | 'bottom';
}

const Component: Wrapper<JsonSchema, RowProps> = ({children, input, schema, wrapperProps}) => {
    const tooltip = React.useMemo(() => {
        if (!schema.description || wrapperProps.descriptionType === 'bottom') {
            return null;
        }

        return (
            <HelpMark>
                <HTMLContent html={schema.description} />
            </HelpMark>
        );
    }, [schema.description, wrapperProps.descriptionType]);

    const bottomDescription = React.useMemo(() => {
        if (!schema.description || wrapperProps.descriptionType !== 'bottom') {
            return null;
        }

        return <HTMLContent html={schema.description} color="secondary" />;
    }, [schema.description, wrapperProps.descriptionType]);

    return (
        <Flex className={b()} alignItems="flex-start" gap={2}>
            <div className={b('left')}>
                <Text
                    className={b('title', {required: wrapperProps.required})}
                    wordBreak="break-word"
                >
                    {schema.title}
                </Text>
                {tooltip}
            </div>
            <div className={b('right')}>
                <Flex gap={2}>
                    {children}
                    <ArrayRemoveButton name={input.name} />
                </Flex>
                {bottomDescription}
            </div>
        </Flex>
    );
};

export const Row = React.memo(Component);
