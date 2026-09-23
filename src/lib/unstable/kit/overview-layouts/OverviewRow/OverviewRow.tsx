import React from 'react';

import {Flex} from '@gravity-ui/uikit';

import type {JsonSchema, NodeLayout} from '../../../core';
import {useSchemaRendererNodeContext} from '../../../core';
import {EntityDescription, EntityTitle, LayoutButtons, LayoutContainer} from '../../components';
import {block} from '../../utils';

import './OverviewRow.scss';

const b = block('overview-row');

export const OverviewRow: NodeLayout<JsonSchema> = ({children, schema}) => {
    const {settings} = useSchemaRendererNodeContext();

    const {hidden} = schema.nodeParameters?.flags || {};

    return (
        <LayoutContainer
            className={b({size: settings?.size})}
            direction="row"
            alignItems="flex-start"
            gap={2}
            hidden={hidden}
            hideEmpty
        >
            <div className={b('left')}>
                <EntityTitle wordBreak="break-all" color="secondary" />
                <EntityDescription className={b('help-mark')} likeHelpMark />
                <div className={b('dots')} />
            </div>
            <Flex className={b('right')} direction="column" gap={0.5} grow={1}>
                <Flex grow={1} gap={2}>
                    {children}
                    <LayoutButtons />
                </Flex>
            </Flex>
        </LayoutContainer>
    );
};
