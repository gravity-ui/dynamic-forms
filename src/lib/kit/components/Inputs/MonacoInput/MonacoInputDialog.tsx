import React from 'react';

import {Dialog} from '@gravity-ui/uikit';
import type {MonacoEditorProps} from 'react-monaco-editor/lib/types';

import {useMonaco} from '../../../../core/components/Form/hooks';
import i18n from '../../../i18n';
import {block} from '../../../utils';

import {MonacoHeader} from './MonacoHeader';
import {useMonacoOptions} from './useMonacoOptions';

import './MonacoInputDialog.scss';

const b = block('monaco-input-dialog');

interface MonacoInputDialogProps {
    name: string;
    visible: boolean;
    value: string;
    language?: string;
    title: string | undefined;
    fontSize: number | undefined;
    onChange: (value: string) => void;
    onClose: () => void;
    changeMonacoValue: (value: string) => void;
    MonacoComponent?: React.ComponentType<MonacoEditorProps>;
}

export const MonacoInputDialog: React.FC<MonacoInputDialogProps> = ({
    name,
    value,
    title,
    visible,
    language,
    onChange,
    onClose,
    changeMonacoValue,
    fontSize,
    MonacoComponent,
}) => {
    const MonacoEditor = useMonaco() || MonacoComponent;

    const handleClose = React.useCallback(() => {
        onChange(value);
        onClose();
    }, [onChange, onClose]);

    const options = useMonacoOptions(fontSize, false);

    if (!MonacoEditor) {
        return null;
    }

    return (
        <Dialog open={visible} onClose={handleClose} className={b()}>
            <Dialog.Header caption={title} className={b('dialog-header')} />
            <Dialog.Body>
                <div className={b('container')} data-qa={`${name}-dialog`}>
                    <MonacoHeader language={language} />
                    <MonacoEditor
                        language={language}
                        height="600"
                        width="900"
                        value={value}
                        onChange={changeMonacoValue}
                        options={options}
                    />
                </div>
            </Dialog.Body>
            <Dialog.Footer
                textButtonApply={i18n('button_cancel')}
                onClickButtonApply={handleClose}
            />
        </Dialog>
    );
};
