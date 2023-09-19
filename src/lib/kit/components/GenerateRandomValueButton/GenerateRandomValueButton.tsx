import React from 'react';

import {Button} from '@gravity-ui/uikit';
import RandExp from 'randexp';
import {v4 as uuidv4} from 'uuid';

import i18n from '../../i18n';
import {block} from '../../utils';

import './GenerateRandomValueButton.scss';

const b = block('generate-random-value-button');

interface GenerateRandomValueButtonProps {
    regex?: string;
    onChange: (value: string) => void;
    children: React.ReactNode;
}

export const GenerateRandomValueButton: React.FC<GenerateRandomValueButtonProps> = ({
    regex,
    onChange,
    children,
}) => {
    const generateRandomString = React.useCallback(() => {
        if (regex) {
            const randExp = new RandExp(regex);
            onChange(randExp.gen());
        } else {
            onChange(uuidv4());
        }
    }, [onChange, regex]);

    return (
        <div className={b()}>
            {children}
            <Button onClick={generateRandomString} className={b('button')}>
                {i18n('button-generate')}
            </Button>
        </div>
    );
};
