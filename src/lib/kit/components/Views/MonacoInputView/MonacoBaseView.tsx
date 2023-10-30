import React from 'react';

import {ChevronsExpandUpRight} from '@gravity-ui/icons';
import {Button, Icon} from '@gravity-ui/uikit';

import {StringViewProps} from '../../../../core';
import {useMonaco} from '../../../../core/components/View/hooks';
import {block} from '../../../utils';
import {MonacoHeader} from '../../Inputs/MonacoInput/MonacoHeader';
import {useMonacoOptions} from '../../Inputs/MonacoInput/useMonacoOptions';

import {MonacoViewDialog} from './MonacoViewDialog';

import './MonacoBaseView.scss';

const b = block('monaco-base-view');

const MonacoBaseView: React.FC<StringViewProps> = ({value, spec}) => {
    const {monacoParams, layoutTitle} = spec.viewSpec;
    const MonacoEditor = useMonaco();

    const {language, fontSize} = monacoParams ?? {language: 'plaintext', fontSize: 12};

    const options = useMonacoOptions(fontSize, true);

    const [monacoEditorDialog, setMonacoEditorDialog] = React.useState<boolean>(false);

    const handleMonacoEditorDialogClose = React.useCallback(() => setMonacoEditorDialog(false), []);

    if (!value || !MonacoEditor) {
        return null;
    }

    return (
        <div className={b()}>
            <MonacoHeader
                language={language}
                editButton={
                    <Button onClick={() => setMonacoEditorDialog(true)}>
                        <Icon data={ChevronsExpandUpRight} size={16}></Icon>
                    </Button>
                }
            />
            <MonacoEditor language={language} value={value} height={'250'} options={options} />
            <MonacoViewDialog
                title={layoutTitle}
                fontSize={fontSize}
                value={value}
                visible={monacoEditorDialog}
                language={language}
                onClose={handleMonacoEditorDialogClose}
            />
        </div>
    );
};

export const MonacoView: React.FC<StringViewProps> = (props) => <MonacoBaseView {...props} />;
