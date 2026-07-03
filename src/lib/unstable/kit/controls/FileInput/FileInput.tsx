import React from 'react';

import {Xmark} from '@gravity-ui/icons';
import {FilePreview, type FilePreviewAction} from '@gravity-ui/uikit';
import {
    unstable_FileDropZone as FileDropZone,
    type FileDropZoneProps,
} from '@gravity-ui/uikit/unstable';

import type {Control, JsonSchemaString} from '../../../core';
import {block, getValidationState} from '../../utils';

import './FileInput.scss';

const b = block('file-input');

export interface FileInputProps extends Omit<FileDropZoneProps, 'multiple'> {
    readAsMethod?: 'readAsBinaryString' | 'readAsDataURL' | 'readAsText';
}

const Component: Control<JsonSchemaString, FileInputProps> = ({
    controlProps,
    input,
    meta,
    schema,
}) => {
    const {readAsMethod = 'readAsBinaryString', ...restControlProps} = controlProps;

    const counterRef = React.useRef(0);
    const [file, setFile] = React.useState<File | null>(null);

    const actions: FilePreviewAction[] = React.useMemo(
        () => [
            {
                id: 'remove',
                title: '',
                icon: <Xmark width={14} height={14} />,
                onClick: () => {
                    input.onChange(undefined);
                    setFile(null);
                },
                tooltipExtraProps: {disabled: true},
            },
        ],
        [input.onChange],
    );

    const onUpdate = React.useCallback(
        (files: File[]) => {
            if (files.length) {
                const reader = new FileReader();

                if (typeof reader[readAsMethod] !== 'function') {
                    throw new Error(`Unknown parameter: ${readAsMethod}`);
                }

                const counter = ++counterRef.current;

                reader.addEventListener('load', () => {
                    if (counter === counterRef.current) {
                        input.onFocus();
                        input.onChange(reader.result);
                        input.onBlur();
                        setFile(files[0]);
                    }
                });

                reader[readAsMethod](files[0]);
            }
        },
        [input.onBlur, input.onChange, input.onFocus, readAsMethod],
    );

    if (file) {
        return <FilePreview file={file} actions={actions} />;
    }

    return (
        <div className={b()}>
            <FileDropZone
                disabled={schema.readOnly}
                accept={[]}
                {...restControlProps}
                onUpdate={onUpdate}
                errorMessage={meta.error}
                validationState={getValidationState(meta)}
                multiple={false}
            />
        </div>
    );
};

export const FileInput = React.memo(Component);
