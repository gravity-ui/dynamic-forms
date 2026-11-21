import React from 'react';

import type {JsonSchemaString, NodeEntity} from '../../../core';
import {EmptyEntityValue, EntityContainer, LongValue, type LongValueProps} from '../../components';
import {block} from '../../utils';
import {getQaBase} from '../../utils/qa';

import './ColorPickerValue.scss';

const b = block('color-picker-value');

export interface ColorPickerValueProps extends Omit<LongValueProps, 'qa' | 'value'> {}

export const ColorPickerValue: NodeEntity<JsonSchemaString, ColorPickerValueProps> = ({
    input,
    schema,
    props,
    settings,
}) => {
    const qaBase = getQaBase(input.name, schema);
    if (!input.value) {
        return <EmptyEntityValue />;
    }

    return (
        <EntityContainer
            className={b()}
            width="fit"
            fill="populated"
            direction="row"
            gap="spacing-1"
            alignItems="center"
        >
            <LongValue variant={settings?.textVariant} {...props} value={input.value} qa={qaBase} />
            {typeof CSS !== 'undefined' &&
            typeof CSS.supports === 'function' &&
            CSS.supports('color', input.value) ? (
                <span className={b('preview')} style={{backgroundColor: input.value}} />
            ) : null}
        </EntityContainer>
    );
};
