import React from 'react';

import {Flex, Text} from '@gravity-ui/uikit';

import type {JsonSchema, NodeLayout} from '../../../core';
import {HelpMark, LayoutButtons, LayoutContainer} from '../../components';
import {block} from '../../utils';

import './OverviewColumn.scss';

const b = block('overview-column');

export const OverviewColumn: NodeLayout<JsonSchema> = ({
    children,
    headName,
    input,
    mode,
    schema,
    settings,
}) => {
    const {hidden} = schema.nodeParameters?.flags || {};

    const tooltip = React.useMemo(() => {
        if (!schema.description) {
            return null;
        }

        return (
            <HelpMark
                className={b('help-mark')}
                settings={settings}
                content={schema.description}
                headName={headName}
            />
        );
    }, [headName, schema.description, settings]);

    return (
        <LayoutContainer className={b({size: settings?.size})} gap={2} hidden={hidden} hideEmpty>
            <Flex direction="column" gap={0.5} grow={1}>
                <div className={b('top')}>
                    <Text
                        className={b('title')}
                        variant={settings?.titleVariant}
                        color="secondary"
                        wordBreak="break-word"
                    >
                        {schema.title}
                    </Text>
                    {tooltip}
                </div>
            </Flex>
            <Flex className={b('bottom')} direction="column" gap={0.5} grow={1}>
                <Flex grow={1} gap={2}>
                    {children}
                    <LayoutButtons
                        mode={mode}
                        name={input.name}
                        headName={headName}
                        schema={schema}
                        settings={settings}
                        value={input.value}
                    />
                </Flex>
            </Flex>
        </LayoutContainer>
    );
};
