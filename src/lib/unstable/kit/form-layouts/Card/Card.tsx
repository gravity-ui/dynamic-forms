import React from 'react';

import {ChevronDown, ChevronUp} from '@gravity-ui/icons';
import {
    Button,
    Flex,
    HelpMark,
    Icon,
    Text,
    Card as UIKitCard,
    type CardProps as UIKitCardProps,
} from '@gravity-ui/uikit';

import {type JsonSchema, type NodeLayout} from '../../../core';
import {ArrayRemoveButton, EntityError, HTMLContent, LayoutContainer} from '../../components';
import {block, getValidationState} from '../../utils';

import './Card.scss';

const b = block('card');

export interface CardProps extends UIKitCardProps {
    descriptionType?: 'tooltip' | 'bottom';
    likeAccordeon?: boolean;
}

const Component: NodeLayout<JsonSchema, CardProps> = ({
    children,
    headName,
    props,
    input,
    meta,
    schema,
}) => {
    const {
        descriptionType = 'tooltip',
        likeAccordeon = true,
        open = true,
        ...restLayoutProps
    } = props;

    const [visible, setVisible] = React.useState(likeAccordeon ? open : true);

    const toggleVisible = React.useCallback(() => {
        setVisible((f) => !f);
    }, []);

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
        <LayoutContainer className={b()}>
            <UIKitCard {...restLayoutProps} className={b('card')}>
                <Flex direction="column" gap={4}>
                    <Flex className={b('header')} direction="column" justifyContent="center">
                        <Flex justifyContent="space-between" alignItems="center">
                            <Flex alignItems="center" gap={2}>
                                <Text variant="subheader-1">{schema.title}</Text>
                                {tooltip}
                            </Flex>
                            <Flex alignItems="center" gap={2}>
                                <ArrayRemoveButton name={input.name} headName={headName} />
                                {likeAccordeon ? (
                                    <Flex width="28px" justifyContent="center">
                                        <Button
                                            onClick={toggleVisible}
                                            size="s"
                                            view="flat-secondary"
                                        >
                                            <Icon
                                                data={visible ? ChevronUp : ChevronDown}
                                                size={16}
                                            />
                                        </Button>
                                    </Flex>
                                ) : null}
                            </Flex>
                        </Flex>
                        {bottomDescription}
                    </Flex>
                    <div className={b('content', {hidden: !visible})}>{children}</div>
                </Flex>
                <EntityError errorMessage={meta.error} validationState={getValidationState(meta)} />
            </UIKitCard>
        </LayoutContainer>
    );
};

export const Card = React.memo(Component);
