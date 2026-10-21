import React from 'react';

import {Button} from '@gravity-ui/uikit';
import isFunction from 'lodash/isFunction';

import i18n from '../../../../kit/i18n';
import {useGenerateRandomValue} from '../../../core/components/Form/hooks';
import type {StringSpec} from '../../../core/types';
import {block} from '../../utils';

import './GenerateRandomValueButton.scss';

const b = block('generate-random-value-button');

interface GenerateRandomValueButtonProps {
    spec: StringSpec;
    onChange: (value: string) => void;
}

/** @deprecated Use the SchemaRenderer API. */
export const GenerateRandomValueButton: React.FC<GenerateRandomValueButtonProps> = ({
    spec,
    onChange,
}) => {
    const generateRandomValue = useGenerateRandomValue();

    if (isFunction(generateRandomValue) && spec.viewSpec.generateRandomValueButton) {
        return (
            <Button onClick={() => onChange(generateRandomValue(spec))} className={b()}>
                {i18n('button-generate')}
            </Button>
        );
    }

    return null;
};
