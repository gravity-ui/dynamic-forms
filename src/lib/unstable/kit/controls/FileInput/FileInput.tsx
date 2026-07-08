import React from 'react';

import {Xmark} from '@gravity-ui/icons';
import {FilePreview, type FilePreviewAction} from '@gravity-ui/uikit';
import {
    unstable_FileDropZone as FileDropZone,
    type FileDropZoneProps,
} from '@gravity-ui/uikit/unstable';

import type {Control, JsonSchemaString} from '../../../core';
import {ControlContainer} from '../../components';
import {getValidationState} from '../../utils';

export interface FileInputProps
    extends Omit<FileDropZoneProps, 'multiple' | 'onUpdate' | 'errorMessage' | 'validationState'> {
    readAsMethod?: 'readAsBinaryString' | 'readAsDataURL' | 'readAsText';
}

const Component: Control<JsonSchemaString, FileInputProps> = ({
    controlProps,
    input,
    meta,
    schema,
}) => {
    const {onBlur, onChange, onFocus} = input;
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
                    onChange(undefined);
                    setFile(null);
                },
                tooltipExtraProps: {disabled: true},
            },
        ],
        [onChange],
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
                        onFocus();
                        onChange(reader.result);
                        onBlur();
                        setFile(files[0]);
                    }
                });

                reader[readAsMethod](files[0]);
            }
        },
        [onBlur, onChange, onFocus, readAsMethod],
    );

    if (file) {
        return (
            <ControlContainer stretch="fit">
                <FilePreview file={file} actions={actions} />
            </ControlContainer>
        );
    }

    return (
        <ControlContainer stretch="max">
            <FileDropZone
                disabled={schema.readOnly}
                accept={[]}
                {...restControlProps}
                onUpdate={onUpdate}
                errorMessage={undefined}
                validationState={getValidationState(meta)}
                multiple={false}
            />
        </ControlContainer>
    );
};

export const FileInput = React.memo(Component);
