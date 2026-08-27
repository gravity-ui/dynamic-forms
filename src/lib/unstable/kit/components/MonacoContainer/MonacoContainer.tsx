import React from 'react';

import {ChevronsCollapseUpRight, ChevronsExpandUpRight, Code} from '@gravity-ui/icons';
import {Button, Flex, Icon, Text} from '@gravity-ui/uikit';

import {block} from '../../utils';

import './MonacoContainer.scss';

const b = block('monaco-container');

export interface MonacoContainerProps {
    children: React.ReactNode;
    dialog?: boolean;
    height: string | number;
    language?: string;
    toggleDialogVisibility?: () => void;
    width: string | number;
    withDialog?: boolean;
    qa?: string;
}

export const MonacoContainer: React.FC<MonacoContainerProps> = ({
    children,
    dialog,
    height,
    language,
    toggleDialogVisibility,
    width,
    withDialog,
    qa,
}) => {
    return (
        <div className={b()} data-qa={qa}>
            <Flex alignItems="center" justifyContent="space-between" className={b('header')}>
                <Flex alignItems="center" gap={1}>
                    <Icon data={Code} size={16} />
                    <Text variant="subheader-1">{language}</Text>
                </Flex>
                {withDialog ? (
                    <Button
                        onClick={toggleDialogVisibility}
                        view="flat-secondary"
                        qa={`${qa}-dialog-toggler`}
                    >
                        <Icon
                            data={dialog ? ChevronsCollapseUpRight : ChevronsExpandUpRight}
                            size={16}
                        />
                    </Button>
                ) : null}
            </Flex>
            <div className={b('control')} style={{width, height}}>
                <div className={b('control-inner')}>{children}</div>
            </div>
        </div>
    );
};
