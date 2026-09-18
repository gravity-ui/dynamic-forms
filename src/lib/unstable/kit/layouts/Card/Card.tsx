import React from 'react';

import {ChevronDown, ChevronUp} from '@gravity-ui/icons';
import {
    Button,
    Flex,
    Icon,
    Text,
    Card as UIKitCard,
    type CardProps as UIKitCardProps,
} from '@gravity-ui/uikit';

import {type JsonSchema, type NodeLayout, SchemaRendererMode} from '../../../core';
import {EntityError, HTMLContent, HelpMark, LayoutButtons, LayoutContainer} from '../../components';
import {useExpanded} from '../../hooks';
import {block, getValidationState} from '../../utils';

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
    meta,
    mode,
    schema,
    settings,
    props,
}) => {
    const {descriptionType = 'tooltip', likeAccordeon = true, ...restLayoutProps} = props;
    const {required, hidden, open = true} = schema.nodeParameters?.flags || {};

    const overviewFlag = mode === SchemaRendererMode.Overview;

    const {expanded, toggleExpanded} = useExpanded({
        headName,
        name: input.name,
        open: likeAccordeon ? open : true,
    });

    const tooltip = React.useMemo(() => {
        if (!schema.description || descriptionType === 'bottom') {
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
    }, [headName, schema.description, descriptionType, settings]);

    const bottomDescription = React.useMemo(() => {
        if (!schema.description || descriptionType !== 'bottom' || overviewFlag) {
            return null;
        }

        return (
            <HTMLContent
                content={schema.description}
                headName={headName}
                color="secondary"
                settings={settings}
            />
        );
    }, [headName, schema.description, descriptionType, overviewFlag, settings]);

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
                            <Flex alignItems="center" gap={2}>
                                <Text
                                    variant={settings?.headVariant}
                                    color="complementary"
                                    className={b('title', {required: required && !overviewFlag})}
                                >
                                    {schema.title}
                                </Text>
                                {tooltip}
                            </Flex>
                            <Flex className={b('header-actions')} alignItems="center" gap={2}>
                                <LayoutButtons
                                    mode={mode}
                                    name={input.name}
                                    headName={headName}
                                    schema={schema}
                                    settings={settings}
                                    value={input.value}
                                />
                                {likeAccordeon ? (
                                    <Flex width="var(--size)" justifyContent="center">
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
                        {bottomDescription}
                    </Flex>
                    <div className={b('content', {hidden: !expanded})}>{children}</div>
                </div>
                {overviewFlag ? null : (
                    <EntityError
                        errorMessage={meta.error}
                        settings={settings}
                        validationState={getValidationState(meta)}
                    />
                )}
            </UIKitCard>
        </LayoutContainer>
    );
};
