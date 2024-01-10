import React from 'react';

import {Xmark} from '@gravity-ui/icons';
import {Button, Icon, Label, Text} from '@gravity-ui/uikit';

import {StringInputProps} from '../../../../core';
import i18n from '../../../../kit/i18n';
import {block} from '../../../utils';

import {readFile} from './utils';

import './FileInput.scss';

const b = block('file-input');

export const FileInput: React.FC<StringInputProps> = ({name, input, spec}) => {
    const {value, onChange} = input;

    const inputRef = React.useRef<HTMLInputElement>(null);

    const [fileName, setFileName] = React.useState<string>('');

    const handleClick = React.useCallback(() => {
        inputRef.current?.click();
    }, []);

    const handleDownload = React.useCallback(
        async (file: Blob) => await readFile(file, spec.viewSpec.fileInput?.readAsMethod),
        [spec.viewSpec.fileInput?.readAsMethod],
    );

    const handleReset = React.useCallback(() => {
        setFileName('');
        onChange('');
    }, [onChange]);

    const handleInputChange = React.useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files;

            if (file && file.length > 0) {
                setFileName(file[0].name);
                const data = (await handleDownload(file[0])) as string;
                onChange(data);
            }
        },
        [handleDownload, onChange],
    );

    const fileNameContent = React.useMemo(() => {
        if (value) {
            if (fileName) {
                return <React.Fragment>{fileName}</React.Fragment>;
            }

            return (
                <Label size="m" theme="info">
                    {i18n('label-data_loaded')}
                </Label>
            );
        }

        return null;
    }, [fileName, value]);

    return (
        <div className={b()}>
            <Button
                disabled={spec.viewSpec.disabled}
                onClick={handleClick}
                qa={`${name}-file-upload`}
            >
                {i18n('button-upload_file')}
            </Button>
            <input
                type="file"
                ref={inputRef}
                autoComplete="off"
                disabled={spec.viewSpec.disabled}
                onChange={handleInputChange}
                className={b('input')}
                tabIndex={-1}
                accept={spec.viewSpec.fileInput?.accept}
            />
            <Text className={b('file-name')} ellipsis={true} color="secondary">
                {fileNameContent}
            </Text>
            {value ? (
                <Button
                    view="flat"
                    onClick={handleReset}
                    disabled={spec.viewSpec.disabled}
                    qa={`${name}-file-remove`}
                >
                    <Icon data={Xmark} size={16} />
                </Button>
            ) : null}
        </div>
    );
};
