import React from 'react';

import type {
    FieldValue,
    JsonSchema,
    SchemaRendererMode,
    SchemaRendererSettings,
} from '../../../core';
import {ArrayRemoveButton} from '../ArrayRemoveButton';
import {CopyButton} from '../CopyButton';
import {DropButton} from '../DropButton';

export interface LayoutButtonsProps {
    name: string;
    headName: string;
    mode: SchemaRendererMode;
    schema: JsonSchema;
    settings?: SchemaRendererSettings;
    value: FieldValue;
}
export const LayoutButtons: React.FC<LayoutButtonsProps> = ({
    mode,
    name,
    headName,
    schema,
    settings,
    value,
}) => {
    return (
        <React.Fragment>
            <ArrayRemoveButton mode={mode} name={name} headName={headName} size={settings?.size} />
            <CopyButton mode={mode} schema={schema} value={value} />
            <DropButton
                mode={mode}
                name={name}
                schema={schema}
                size={settings?.size}
                value={value}
                variant={settings?.textVariant}
            />
        </React.Fragment>
    );
};
