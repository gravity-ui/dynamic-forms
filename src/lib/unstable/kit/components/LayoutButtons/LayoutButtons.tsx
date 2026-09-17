import React from 'react';

import type {FieldValue, JsonSchema, SchemaRendererMode} from '../../../core';
import {ArrayRemoveButton} from '../ArrayRemoveButton';
import {CopyButton} from '../CopyButton';
import {DropButton} from '../DropButton';

export interface LayoutButtonsProps {
    name: string;
    headName: string;
    mode: SchemaRendererMode;
    schema: JsonSchema;
    value: FieldValue;
}
export const LayoutButtons: React.FC<LayoutButtonsProps> = ({
    mode,
    name,
    headName,
    schema,
    value,
}) => {
    return (
        <React.Fragment>
            <ArrayRemoveButton mode={mode} name={name} headName={headName} />
            <CopyButton mode={mode} schema={schema} value={value} />
            <DropButton mode={mode} name={name} schema={schema} value={value} />
        </React.Fragment>
    );
};
