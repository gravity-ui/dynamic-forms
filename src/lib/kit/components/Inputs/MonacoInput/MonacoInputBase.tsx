import React from 'react';

import {ChevronsExpandUpRight} from '@gravity-ui/icons';
import {Button, Icon} from '@gravity-ui/uikit';
import type {MonacoEditorProps} from 'react-monaco-editor/lib/types';

import {StringInputProps} from '../../../../core/';
import {useMonaco} from '../../../../core/components/Form/hooks';
import {block} from '../../../utils';

import {MonacoHeader} from './MonacoHeader';
import {MonacoInputDialog} from './MonacoInputDialog';
import {useMonacoOptions} from './useMonacoOptions';

import './MonacoInputBase.scss';

const b = block('monaco-input');

export interface MonacoInputBaseProps extends StringInputProps {
    card?: boolean;
    MonacoComponent?: React.ComponentType<MonacoEditorProps>;
    withoutDialog?: boolean;
}

export const MonacoInputBase: React.FC<MonacoInputBaseProps> = ({
    name,
    input,
    spec,
    card,
    MonacoComponent,
    withoutDialog,
}) => {
    const {value, onChange} = input;

    const MonacoEditor = useMonaco() || MonacoComponent;

    const {monacoParams, disabled, layoutTitle} = spec.viewSpec;

    const {language, fontSize} = monacoParams ?? {language: 'plaintext', fontSize: 11};

    const [monacoEditorDialog, setMonacoEditorDialog] = React.useState<boolean>(false);

    const [monacoValue, setMonacoValue] = React.useState<string>(value);

    const handleMonacoEditorDialogClose = React.useCallback(() => setMonacoEditorDialog(false), []);

    const dialogButton = React.useMemo(() => {
        if (!withoutDialog) {
            return (
                <Button onClick={() => setMonacoEditorDialog(true)} qa={`${name}-open-dialog`}>
                    <Icon data={ChevronsExpandUpRight} size={16} />
                </Button>
            );
        }

        return;
    }, [withoutDialog, setMonacoEditorDialog, name]);

    React.useEffect(() => onChange(monacoValue), [monacoValue]);

    const options = useMonacoOptions(fontSize, disabled ?? false);

    if (!MonacoEditor) {
        return null;
    }

    return (
        <div className={b({card})}>
            <div className={b('container')} data-qa={name}>
                <MonacoHeader language={language} card={card} editButton={dialogButton} />
                <MonacoEditor
                    language={language}
                    value={monacoValue}
                    height="300"
                    onChange={setMonacoValue}
                    options={options}
                />
            </div>
            <MonacoInputDialog
                name={name}
                title={layoutTitle}
                fontSize={fontSize}
                value={monacoValue}
                visible={monacoEditorDialog}
                language={language}
                card={card}
                changeMonacoValue={setMonacoValue}
                onChange={onChange}
                onClose={handleMonacoEditorDialogClose}
                MonacoComponent={MonacoComponent}
            />
        </div>
    );
};

export const MonacoInput: React.FC<MonacoInputBaseProps> = (props) => (
    <MonacoInputBase {...props} />
);

export const MonacoInputCard: React.FC<MonacoInputBaseProps> = (props) => (
    <MonacoInputBase {...props} card={true} />
);
