import React from 'react';

import {Xmark} from '@gravity-ui/icons';
import {Button, Icon} from '@gravity-ui/uikit';

import {ReadAsMethod, StringInputProps} from '../../../../core';
import i18n from '../../../../kit/i18n';
import {block} from '../../../utils';

import './FileInput.scss';

const b = block('file-input');

export const FileInput: React.FC<StringInputProps> = ({input, spec}) => {
    const {value, onChange} = input;

    const inputRef = React.useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = React.useState<string | null>('');

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
            } else {
                handleReset();
            }
        },
        [handleDownload, handleReset, onChange],
    );

    return (
        <div className={b()}>
            <Button disabled={spec.viewSpec.disabled} onClick={handleClick}>
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
            <span className={b('file-name')}>
                {fileName || value ? fileName || i18n('label-data_loaded') : null}
            </span>
            {fileName || value ? (
                <Button view="flat" onClick={handleReset} disabled={spec.viewSpec.disabled}>
                    <Icon data={Xmark} size={16} />
                </Button>
            ) : null}
        </div>
    );
};

export function readFile(
    file: Blob,
    readAsMethod: ReadAsMethod = 'readAsBinaryString',
): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        if (typeof reader[readAsMethod] !== 'function') {
            reject(new Error(`Unknown parameter: ${readAsMethod}`));
            return;
        }

        reader.addEventListener('load', () => resolve(reader.result));
        reader.addEventListener('error', () => reject(reader.error));

        reader[readAsMethod](file);
    });
}
