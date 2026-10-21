import React from 'react';

import {Text} from '@gravity-ui/uikit';

import {useSchemaRendererNodeContext} from '../../../core';
import {block, getValidationState} from '../../utils';

import './EntityError.scss';

const b = block('entity-error');

export const EntityError: React.FC = () => {
    const {meta, settings} = useSchemaRendererNodeContext();

    const validationState = getValidationState(meta);

    if (validationState === 'invalid' && meta.error) {
        return (
            <Text
                className={b()}
                variant={settings?.textVariant}
                color="danger"
                wordBreak="break-word"
                data-sr-error="true"
            >
                {meta.error}
            </Text>
        );
    }

    return null;
};
