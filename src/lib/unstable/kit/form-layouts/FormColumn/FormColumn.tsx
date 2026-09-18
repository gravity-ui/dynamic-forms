import React from 'react';

import {Flex, Text} from '@gravity-ui/uikit';

import type {JsonSchema, NodeLayout} from '../../../core';
import {EntityError, HTMLContent, HelpMark, LayoutButtons, LayoutContainer} from '../../components';
import {block, getValidationState} from '../../utils';

import './FormColumn.scss';

const b = block('form-column');

export interface FormColumnProps {
    descriptionType?: 'tooltip' | 'bottom';
}

export const FormColumn: NodeLayout<JsonSchema, FormColumnProps> = ({
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
        <LayoutContainer className={b()} gap={2} hidden={hidden}>
            <Flex direction="column" gap={0.5}>
                <Flex alignItems="center" gap={2}>
                    <div className={b('title')}>
                        <Text
                            className={b('title-text', {required})}
                            variant={settings?.titleVariant}
                            color="complementary"
                            wordBreak="break-word"
                        >
                            {schema.title}
                        </Text>
                        {tooltip}
                    </div>
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
            </Flex>
            <Flex className={b('bottom')} direction="column" gap={0.5}>
                {children}
                <EntityError
                    errorMessage={meta.error}
                    settings={settings}
                    validationState={getValidationState(meta)}
                />
            </Flex>
        </LayoutContainer>
    );
};
