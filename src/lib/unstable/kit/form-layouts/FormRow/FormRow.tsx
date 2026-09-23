import React from 'react';

import {Flex} from '@gravity-ui/uikit';

import type {JsonSchema, NodeLayout} from '../../../core';
import {useSchemaRendererNodeContext} from '../../../core';
import {
    EntityDescription,
    EntityError,
    EntityTitle,
    LayoutButtons,
    LayoutContainer,
} from '../../components';
import {block} from '../../utils';

import './FormRow.scss';

const b = block('form-row');

export interface FormRowProps {
    descriptionType?: 'tooltip' | 'bottom';
}

export const FormRow: NodeLayout<JsonSchema, FormRowProps> = ({children, schema, props}) => {
    const {settings} = useSchemaRendererNodeContext();

    const {descriptionType} = props;
    const {hidden} = schema.nodeParameters?.flags || {};

    return (
        <LayoutContainer
            className={b({size: settings?.size})}
            direction="row"
            alignItems="flex-start"
            gap={2}
            hidden={hidden}
        >
            <div className={b('left')}>
                <EntityTitle />
                {descriptionType === 'tooltip' ? (
                    <EntityDescription className={b('help-mark')} likeHelpMark />
                ) : null}
            </div>
            <Flex className={b('right')} direction="column" gap={0.5} grow={1}>
                <Flex className={b('right-content')} alignItems="center" grow={1} gap={2}>
                    {children}
                    <LayoutButtons />
                </Flex>
                {descriptionType === 'bottom' ? <EntityDescription /> : null}
                <EntityError />
            </Flex>
        </LayoutContainer>
    );
};
