import React from 'react';

import {Button} from '@gravity-ui/uikit';

import {useGenerateRandomValue} from '../../../core/components/Form/hooks';
import i18n from '../../i18n';
import {block} from '../../utils';

import './GenerateRandomValueButton.scss';

const b = block('generate-random-value-button');

interface GenerateRandomValueButtonProps {
    regexp?: string;
    onChange: (value: string) => void;
    children: React.ReactNode;
}

export const GenerateRandomValueButton: React.FC<GenerateRandomValueButtonProps> = ({
    regexp,
    onChange,
    children,
}) => {
    const generateRandomValue = useGenerateRandomValue();

    return (
        <div className={b()}>
            {children}
            {generateRandomValue ? (
                <Button
                    onClick={() => generateRandomValue({regexp, onChange})}
                    className={b('button')}
                >
                    {i18n('button-generate')}
                </Button>
            ) : null}
        </div>
    );
};
