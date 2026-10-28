import React from 'react';

import {ChevronsExpandUpRight} from '@gravity-ui/icons';
import {Button, Icon} from '@gravity-ui/uikit';
import type {MonacoEditorProps} from 'react-monaco-editor/lib/types';

import type {StringInputProps} from '../../../../core/';
import {useMonaco} from '../../../../core/components/Form/hooks';
import {block} from '../../../utils';

import {MonacoHeader} from './MonacoHeader';
import {MonacoInputDialog} from './MonacoInputDialog';
import {useMonacoOptions} from './useMonacoOptions';

import './MonacoInputBase.scss';

const b = block('monaco-input');

export interface MonacoInputBaseProps extends StringInputProps {
    MonacoComponent?: React.ComponentType<MonacoEditorProps>;
    withoutDialog?: boolean;
}

export const MonacoInputBase: React.FC<MonacoInputBaseProps> = ({
    name,
    input,
    spec,
    MonacoComponent,
    withoutDialog,
}) => {
    const {value, onChange} = input;

    const MonacoEditor = useMonaco() || MonacoComponent;

    const {monacoParams, disabled, layoutTitle} = spec.viewSpec;

    const {
        language = 'plaintext',
        fontSize = 11,
        headerIconSize = 18,
        headerIconIndent = 5,
        headerTitleVariant = 'body-2',
        headerDialogButtonSize = 'm',
        headerDialogIconSize = 16,
    } = monacoParams || {};

    const [monacoEditorDialog, setMonacoEditorDialog] = React.useState<boolean>(false);

    const [monacoValue, setMonacoValue] = React.useState<string>(value);

    const handleMonacoEditorDialogClose = React.useCallback(() => setMonacoEditorDialog(false), []);

    const dialogButton = React.useMemo(() => {
        if (!withoutDialog) {
            return (
                <Button
                    size={headerDialogButtonSize}
                    onClick={() => setMonacoEditorDialog(true)}
                    qa={`${name}-open-dialog`}
                >
                    <Icon data={ChevronsExpandUpRight} size={headerDialogIconSize} />
                </Button>
            );
        }

        return;
    }, [withoutDialog, setMonacoEditorDialog, name, headerDialogButtonSize, headerDialogIconSize]);

    React.useEffect(() => onChange(monacoValue), [monacoValue]);

    const options = useMonacoOptions(fontSize, disabled ?? false);

    if (!MonacoEditor) {
        return null;
    }

    return (
        <div className={b()}>
            <div className={b('container')} data-qa={name}>
                <MonacoHeader
                    language={language}
                    dialogButton={dialogButton}
                    headerIconSize={headerIconSize}
                    headerIconIndent={headerIconIndent}
                    headerTitleVariant={headerTitleVariant}
                />
                <div className={b('editor')}>
                    <MonacoEditor
                        language={language}
                        value={monacoValue}
                        onChange={setMonacoValue}
                        options={options}
                    />
                </div>
            </div>
            <MonacoInputDialog
                name={name}
                title={layoutTitle}
                fontSize={fontSize}
                value={monacoValue}
                visible={monacoEditorDialog}
                language={language}
                changeMonacoValue={setMonacoValue}
                onChange={onChange}
                onClose={handleMonacoEditorDialogClose}
                MonacoComponent={MonacoComponent}
                headerIconSize={headerIconSize}
                headerIconIndent={headerIconIndent}
                headerTitleVariant={headerTitleVariant}
            />
        </div>
    );
};

export const MonacoInput: React.FC<MonacoInputBaseProps> = (props) => (
    <MonacoInputBase {...props} />
);
