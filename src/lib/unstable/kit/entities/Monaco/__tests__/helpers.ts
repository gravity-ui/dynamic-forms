import {JsonSchemaType, NodeType} from '../../../../core/constants';
import type {JsonSchemaString} from '../../../../core/types';

export const createSchema = (layout: string | undefined): JsonSchemaString => ({
    type: JsonSchemaType.String,
    title: 'Monaco',
    description: 'Description for Monaco',

    nodeParameters: {
        type: NodeType.String,
        entity: 'monaco_input',
        layout,
        entityProps: {
            language: 'json',
            height: 180,
            width: '100%',
            withDialog: true,
            ignoreMonacoErrors: false,
            options: {scrollBeyondLastLine: false, lineNumbers: 'on'},
        },
        flags: {open: true},
        layoutProps: {descriptionType: 'bottom'},
    },
});

export const value = '{"enabled":true}';
