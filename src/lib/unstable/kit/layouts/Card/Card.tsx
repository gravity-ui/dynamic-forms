import React from 'react';

import {ChevronDown, ChevronUp} from '@gravity-ui/icons';
import {
    Button,
    Flex,
    Icon,
    Card as UIKitCard,
    type CardProps as UIKitCardProps,
} from '@gravity-ui/uikit';

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
import {useExpanded} from '../../hooks';
import {block} from '../../utils';

import './Card.scss';

const b = block('card');

export interface CardProps extends UIKitCardProps {
    descriptionType?: 'tooltip' | 'bottom';
    likeAccordeon?: boolean;
}

export const Card: NodeLayout<JsonSchema, CardProps> = ({
    children,
    headName,
    input,
    mode,
    schema,
    props,
}) => {
    const {settings} = useSchemaRendererNodeContext();

    const {descriptionType = 'tooltip', likeAccordeon = true, ...restLayoutProps} = props;
    const {hidden, open = true} = schema.nodeParameters?.flags || {};

    const overviewFlag = mode === SchemaRendererMode.Overview;

    const {expanded, toggleExpanded} = useExpanded({
        headName,
        name: input.name,
        open: likeAccordeon ? open : true,
    });

    return (
        <LayoutContainer
            className={b({size: settings?.size})}
            hideEmpty={overviewFlag}
            hidden={hidden}
        >
            <UIKitCard {...restLayoutProps} className={b('card')}>
                <div className={b('inner', {hidden: !expanded})}>
                    <Flex className={b('header')} direction="column" justifyContent="center">
                        <Flex justifyContent="space-between" alignItems="center">
                            <Flex alignItems="center" gap={1}>
                                <EntityTitle type="head" />
                                {descriptionType === 'tooltip' ? (
                                    <EntityDescription className={b('help-mark')} likeHelpMark />
                                ) : null}
                            </Flex>
                            <Flex className={b('header-actions')} alignItems="center" gap={2}>
                                <LayoutButtons />
                                {likeAccordeon ? (
                                    <Flex justifyContent="center">
                                        <Button
                                            onClick={toggleExpanded}
                                            size={settings?.size}
                                            view="flat-secondary"
                                        >
                                            <Icon
                                                data={expanded ? ChevronUp : ChevronDown}
                                                size={16}
                                            />
                                        </Button>
                                    </Flex>
                                ) : null}
                            </Flex>
                        </Flex>
                        {descriptionType === 'bottom' ? <EntityDescription /> : null}
                    </Flex>
                    <div className={b('content', {hidden: !expanded})}>{children}</div>
                </div>
                {overviewFlag ? null : <EntityError />}
            </UIKitCard>
        </LayoutContainer>
    );
};
