import React from 'react';

import {Dialog, type TextProps} from '@gravity-ui/uikit';

import {useMonaco} from '../../../../core/components/View/hooks';
import i18n from '../../../i18n';
import {block} from '../../../utils';
import {MonacoHeader} from '../../Inputs/MonacoInput/MonacoHeader';
import {useMonacoOptions} from '../../Inputs/MonacoInput/useMonacoOptions';

import './MonacoViewDialog.scss';

const b = block('monaco-view-dialog');

interface MonacoViewDialogProps {
    visible: boolean;
    value: string;
    language: string;
    title: string | undefined;
    fontSize: number | undefined;
    onClose: () => void;
    headerIconSize: number;
    headerIconIndent: number;
    headerTitleVariant: TextProps['variant'];
}

export const MonacoViewDialog: React.FC<MonacoViewDialogProps> = ({
    value,
    title,
    visible,
    language,
    onClose,
    fontSize,
    headerIconSize,
    headerIconIndent,
    headerTitleVariant,
}) => {
    const MonacoEditor = useMonaco();

    const handleClose = React.useCallback(() => {
        onClose();
    }, [onClose]);

    const options = useMonacoOptions(fontSize, true);

    if (!MonacoEditor) {
        return null;
    }

    return (
        <Dialog open={visible} onClose={handleClose} className={b()}>
            <Dialog.Header caption={title} className={b('dialog-header')} />
            <Dialog.Body>
                <div className={b('container')}>
                    <MonacoHeader
                        language={language}
                        headerIconSize={headerIconSize}
                        headerIconIndent={headerIconIndent}
                        headerTitleVariant={headerTitleVariant}
                    />
                    <div className={b('editor')}>
                        <MonacoEditor language={language} value={value} options={options} />
                    </div>
                </div>
            </Dialog.Body>
            <Dialog.Footer
                textButtonApply={i18n('button_cancel')}
                onClickButtonApply={handleClose}
            />
        </Dialog>
    );
};
