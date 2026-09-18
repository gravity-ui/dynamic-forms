import React from 'react';

import {Flex, Text} from '@gravity-ui/uikit';

import type {JsonSchema, NodeLayout} from '../../../core';
import {EntityError, HTMLContent, HelpMark, LayoutButtons, LayoutContainer} from '../../components';
import {block, getValidationState} from '../../utils';

import './FormRow.scss';

const b = block('form-row');

export interface FormRowProps {
    descriptionType?: 'tooltip' | 'bottom';
}

export const FormRow: NodeLayout<JsonSchema, FormRowProps> = ({
    children,
    headName,
    input,
    meta,
    mode,
    schema,
    settings,
    props,
}) => {
    const {hidden, required} = schema.nodeParameters?.flags || {};

    const tooltip = React.useMemo(() => {
        if (!schema.description || props.descriptionType === 'bottom') {
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
    }, [headName, schema.description, props.descriptionType, settings]);

    const bottomDescription = React.useMemo(() => {
        if (!schema.description || props.descriptionType !== 'bottom') {
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
    }, [headName, schema.description, props.descriptionType, settings]);

    return (
        <LayoutContainer
            className={b({size: settings?.size})}
            direction="row"
            alignItems="flex-start"
            gap={2}
            hidden={hidden}
        >
            <div className={b('left')}>
                <Text
                    className={b('title', {required})}
                    variant={settings?.titleVariant}
                    color="complementary"
                    wordBreak="break-word"
                >
                    {schema.title}
                </Text>
                {tooltip}
            </div>
            <Flex className={b('right')} direction="column" gap={0.5} grow={1}>
                <Flex className={b('right-content')} alignItems="center" grow={1} gap={2}>
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
                {bottomDescription}
                <EntityError
                    errorMessage={meta.error}
                    settings={settings}
                    validationState={getValidationState(meta)}
                />
            </Flex>
        </LayoutContainer>
    );
};
