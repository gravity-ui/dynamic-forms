import React from 'react';

import {Flex, type TextProps} from '@gravity-ui/uikit';

import {
    type JsonSchema,
    type NodeLayout,
    SchemaRendererMode,
    useSchemaRendererNodeContext,
} from '../../../core';
import {
    EntityDescription,
    EntityError,
    EntityTitle,
    LayoutButtons,
    LayoutContainer,
} from '../../components';
import {block} from '../../utils';

import './Section.scss';

const b = block('section');

export interface SectionProps extends TextProps {
    descriptionType?: 'tooltip' | 'bottom';
    withIndent?: boolean;
}

export const Section: NodeLayout<JsonSchema, SectionProps> = ({children, mode, schema, props}) => {
    const {settings} = useSchemaRendererNodeContext();

    const {descriptionType = 'tooltip', withIndent = false, ...restLayoutProps} = props;
    const {hidden} = schema.nodeParameters?.flags || {};

    const overviewFlag = mode === SchemaRendererMode.Overview;

    return (
        <LayoutContainer
            className={b({size: settings?.size})}
            gap="spacing-half"
            hideEmpty={overviewFlag}
            hidden={hidden}
        >
            <Flex direction="column" gap="spacing-4">
                <Flex direction="column" gap="spacing-1">
                    <Flex className={b('header')} gap="spacing-2" alignItems="center">
                        <Flex alignItems="center" gap="spacing-1">
                            <EntityTitle type="head" {...restLayoutProps} />
                            {descriptionType === 'tooltip' ? (
                                <EntityDescription likeHelpMark />
                            ) : null}
                        </Flex>
                        <LayoutButtons />
                    </Flex>
                    {descriptionType === 'bottom' ? <EntityDescription /> : null}
                </Flex>
                <div className={b('content', {'with-indent': withIndent})}>{children}</div>
            </Flex>
            {overviewFlag ? null : <EntityError />}
        </LayoutContainer>
    );
};
