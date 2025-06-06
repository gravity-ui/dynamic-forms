import React from 'react';

import {ChevronsExpandUpRight} from '@gravity-ui/icons';
import {Button, Icon} from '@gravity-ui/uikit';

import type {StringViewProps} from '../../../../core';
import {useMonaco} from '../../../../core/components/View/hooks';
import {block} from '../../../utils';
import {MonacoHeader} from '../../Inputs/MonacoInput/MonacoHeader';
import {useMonacoOptions} from '../../Inputs/MonacoInput/useMonacoOptions';

import {MonacoViewDialog} from './MonacoViewDialog';

import './MonacoBaseView.scss';

const b = block('monaco-base-view');

const MonacoBaseView: React.FC<StringViewProps> = ({value, spec, name}) => {
    const {monacoParams, layoutTitle} = spec.viewSpec;
    const MonacoEditor = useMonaco();

    const {
        language = 'plaintext',
        fontSize = 11,
        headerIconSize = 18,
        headerIconIndent = 5,
        headerTitleVariant = 'body-2',
        headerDialogButtonSize = 'm',
        headerDialogIconSize = 16,
    } = monacoParams || {};

    const options = useMonacoOptions(fontSize, true);

    const [monacoEditorDialog, setMonacoEditorDialog] = React.useState<boolean>(false);

    const handleMonacoEditorDialogClose = React.useCallback(() => setMonacoEditorDialog(false), []);

    const dialogButton = React.useMemo(() => {
        return (
            <Button
                size={headerDialogButtonSize}
                onClick={() => setMonacoEditorDialog(true)}
                qa={`${name}-open-dialog`}
            >
                <Icon data={ChevronsExpandUpRight} size={headerDialogIconSize} />
            </Button>
        );
    }, [setMonacoEditorDialog, name, headerDialogButtonSize, headerDialogIconSize]);

    if (!value || !MonacoEditor) {
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
                    <MonacoEditor language={language} value={value} options={options} />
                </div>
            </div>
            <MonacoViewDialog
                title={layoutTitle}
                fontSize={fontSize}
                value={value}
                visible={monacoEditorDialog}
                language={language}
                onClose={handleMonacoEditorDialogClose}
                headerIconSize={headerIconSize}
                headerIconIndent={headerIconIndent}
                headerTitleVariant={headerTitleVariant}
            />
        </div>
    );
};

export const MonacoView: React.FC<StringViewProps> = (props) => <MonacoBaseView {...props} />;
