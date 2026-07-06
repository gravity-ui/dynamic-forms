import React from 'react';

import {Flex, HelpMark, Text, type TextProps} from '@gravity-ui/uikit';

import type {JsonSchema, Wrapper} from '../../../core';
import {ArrayRemoveButton, HTMLContent} from '../../components';
import {block} from '../../utils';

import './Section.scss';

const b = block('section');

export interface SectionProps extends TextProps {
    descriptionType?: 'tooltip' | 'bottom';
    withIndent?: boolean;
}

const Component: Wrapper<JsonSchema, SectionProps> = ({children, input, schema, wrapperProps}) => {
    const {descriptionType = 'tooltip', withIndent = false, ...restWrapperProps} = wrapperProps;

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
        if (!schema.description || descriptionType !== 'bottom') {
            return null;
        }

        return <HTMLContent html={schema.description} color="secondary" />;
    }, [schema.description, descriptionType]);

    return (
        <Flex direction="column" gap={4} className={b()}>
            <Flex direction="column" gap={2}>
                <Flex className={b('header')} gap={2} alignItems="center">
                    <Text variant="subheader-1" {...restWrapperProps}>
                        {schema.title}
                    </Text>
                    {tooltip}
                    <ArrayRemoveButton name={input.name} />
                </Flex>
                {bottomDescription}
            </Flex>
            <div className={b('content', {'with-indent': withIndent})}>{children}</div>
        </Flex>
    );
};

export const Section = React.memo(Component);
