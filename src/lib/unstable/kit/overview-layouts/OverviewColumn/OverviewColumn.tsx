import React from 'react';

import {Flex} from '@gravity-ui/uikit';

import type {JsonSchema, NodeLayout} from '../../../core';
import {useSchemaRendererNodeContext} from '../../../core';
import {EntityDescription, EntityTitle, LayoutButtons, LayoutContainer} from '../../components';
import {block} from '../../utils';

import './OverviewColumn.scss';

const b = block('overview-column');

export const OverviewColumn: NodeLayout<JsonSchema> = ({children, schema}) => {
    const {settings} = useSchemaRendererNodeContext();

    const {hidden} = schema.nodeParameters?.flags || {};

    return (
        <LayoutContainer className={b({size: settings?.size})} gap={2} hidden={hidden} hideEmpty>
            <Flex direction="column" gap={0.5} grow={1}>
                <div className={b('top')}>
                    <EntityTitle color="secondary" />
                    <EntityDescription className={b('help-mark')} likeHelpMark />
                </div>
            </Flex>
            <Flex className={b('bottom')} direction="column" gap={0.5} grow={1}>
                <Flex grow={1} gap={2}>
                    {children}
                    <LayoutButtons />
                </Flex>
            </Flex>
        </LayoutContainer>
    );
};
