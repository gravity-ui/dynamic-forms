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

import {type JsonSchema, type NodeLayout, SchemaRendererMode} from '../../../core';
import {
    ArrayRemoveButton,
    CopyButton,
    EntityError,
    HTMLContent,
    LayoutContainer,
} from '../../components';
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
    props,
}) => {
    const {
        copy,
        descriptionType = 'tooltip',
        likeAccordeon = true,
        open = true,
        required,
        ...restLayoutProps
    } = props;

    const overviewFlag = mode === SchemaRendererMode.Overview;

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
        if (!schema.description || descriptionType !== 'bottom' || overviewFlag) {
            return null;
        }

        return <HTMLContent html={schema.description} color="secondary" />;
    }, [schema.description, descriptionType, overviewFlag]);

    return (
        <LayoutContainer className={b()} hideEmpty={overviewFlag}>
            <UIKitCard {...restLayoutProps} className={b('card')}>
                <div className={b('inner', {hidden: !visible})}>
                    <Flex className={b('header')} direction="column" justifyContent="center">
                        <Flex justifyContent="space-between" alignItems="center">
                            <Flex alignItems="center" gap={2}>
                                <Text
                                    variant="subheader-1"
                                    className={b('title', {required: required && !overviewFlag})}
                                >
                                    {schema.title}
                                </Text>
                                {tooltip}
                            </Flex>
                            <Flex className={b('header-actions')} alignItems="center" gap={2}>
                                {overviewFlag ? (
                                    <CopyButton
                                        className={b('copy-button')}
                                        copy={copy}
                                        value={input.value}
                                    />
                                ) : null}
                                {overviewFlag ? null : (
                                    <ArrayRemoveButton name={input.name} headName={headName} />
                                )}
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
                </div>
                {overviewFlag ? null : (
                    <EntityError
                        errorMessage={meta.error}
                        validationState={getValidationState(meta)}
                    />
                )}
            </UIKitCard>
        </LayoutContainer>
    );
};
