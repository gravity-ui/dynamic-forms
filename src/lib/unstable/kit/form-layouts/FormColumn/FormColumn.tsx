import React from 'react';

import {Flex} from '@gravity-ui/uikit';

import type {JsonSchema, NodeLayout} from '../../../core';
import {
    EntityDescription,
    EntityError,
    EntityTitle,
    LayoutButtons,
    LayoutContainer,
} from '../../components';
import {block} from '../../utils';

import './FormColumn.scss';

const b = block('form-column');

export interface FormColumnProps {
    descriptionType?: 'tooltip' | 'bottom';
}

export const FormColumn: NodeLayout<JsonSchema, FormColumnProps> = ({
    children,
    schema,
    props,
    settings,
}) => {
    const {descriptionType} = props;
    const {hidden} = schema.nodeParameters?.flags || {};

    return (
        <LayoutContainer className={b({size: settings?.size})} gap={1} hidden={hidden}>
            <Flex direction="column" gap={0.5}>
                <Flex alignItems="center">
                    <div className={b('title')}>
                        <EntityTitle />
                        {descriptionType === 'tooltip' ? (
                            <EntityDescription className={b('help-mark')} likeHelpMark />
                        ) : null}
                    </div>
                    <LayoutButtons />
                </Flex>
                {descriptionType === 'bottom' ? <EntityDescription /> : null}
            </Flex>
            <Flex className={b('bottom')} direction="column" gap={0.5}>
                {children}
                <EntityError />
            </Flex>
        </LayoutContainer>
    );
};
