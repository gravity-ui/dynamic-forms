import React from 'react';

import {Button} from '@gravity-ui/uikit';
import _ from 'lodash';

import {useGenerateRandomValue} from '../../../core/components/Form/hooks';
import {StringSpec} from '../../../core/types';
import i18n from '../../i18n';
import {block} from '../../utils';

import './GenerateRandomValueButton.scss';

const b = block('generate-random-value-button');

interface GenerateRandomValueButtonProps {
    spec: StringSpec;
    onChange: (value: string) => void;
}

export const GenerateRandomValueButton: React.FC<GenerateRandomValueButtonProps> = ({
    spec,
    onChange,
}) => {
    const generateRandomValue = useGenerateRandomValue();

    if (_.isFunction(generateRandomValue) && spec.viewSpec.generateRandomValueButton) {
        return (
            <Button onClick={() => onChange(generateRandomValue(spec))} className={b()}>
                {i18n('button-generate')}
            </Button>
        );
    }

    return null;
};
