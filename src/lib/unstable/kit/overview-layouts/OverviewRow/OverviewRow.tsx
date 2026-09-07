import React from 'react';

import {Flex, HelpMark, Text} from '@gravity-ui/uikit';

import type {JsonSchema, NodeLayout} from '../../../core';
import {CopyButton, HTMLContent, LayoutContainer} from '../../components';
import {block} from '../../utils';

import './OverviewRow.scss';

const b = block('overview-row');

export const OverviewRow: NodeLayout<JsonSchema> = ({children, headName, input, schema}) => {
    const {copy, hidden} = schema.nodeParameters?.flags || {};

    const tooltip = React.useMemo(() => {
        if (!schema.description) {
            return null;
        }

        return (
            <HelpMark className={b('help-mark')}>
                <HTMLContent content={schema.description} headName={headName} />
            </HelpMark>
        );
    }, [headName, schema.description]);

    return (
        <LayoutContainer
            className={b()}
            direction="row"
            alignItems="flex-start"
            gap={2}
            hidden={hidden}
            hideEmpty
        >
            <div className={b('left')}>
                <Text className={b('title')} color="secondary" wordBreak="break-all">
                    {schema.title}
                </Text>
                {tooltip}
                <div className={b('dots')} />
            </div>
            <Flex className={b('right')} direction="column" gap={0.5} grow={1}>
                <Flex grow={1} gap={2}>
                    {children}
                    <CopyButton className={b('copy-button')} copy={copy} value={input.value} />
                </Flex>
            </Flex>
        </LayoutContainer>
    );
};
