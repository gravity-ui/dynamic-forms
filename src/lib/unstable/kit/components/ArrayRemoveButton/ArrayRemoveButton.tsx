import React from 'react';

import {TrashBin} from '@gravity-ui/icons';
import {Button, Icon} from '@gravity-ui/uikit';
import {useForm} from 'react-final-form';

import {SchemaRendererMode, useSchemaRendererNodeContext} from '../../../core';
import {
    block,
    getArrayItemIndex,
    getArrayItemParentName,
    isArrayItem,
    isTupleItem,
} from '../../utils';

const b = block('array-remove-button');

export interface ArrayRemoveButtonProps {
    name?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ArrayRemoveButton: React.FC<ArrayRemoveButtonProps> = ({name: nameProps, onClick}) => {
    const {mode, name: contextName, headName, settings} = useSchemaRendererNodeContext();

    const form = useForm();

    const name = nameProps ?? contextName;

    const arrayItem = isArrayItem(name);
    const tupleItem = isTupleItem(name, headName, form);
    const overviewFlag = mode === SchemaRendererMode.Overview;

    const removeItem = React.useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            onClick?.(event);

            const parentName = getArrayItemParentName(name);
            const parentValue = form.getFieldState(parentName)?.value;
            const index = Number(getArrayItemIndex(name));

            if (Array.isArray(parentValue)) {
                form.focus(parentName);
                form.change(
                    parentName,
                    parentValue.filter((_, i) => i !== index),
                );
                form.blur(parentName);
            }
        },
        [form, name, onClick],
    );

    if (arrayItem && !tupleItem && !overviewFlag) {
        return (
            <Button
                className={b()}
                view="flat-secondary"
                onClick={removeItem}
                size={settings?.size}
                qa={`${name}-remove-button`}
            >
                <Icon data={TrashBin} size={16} />
            </Button>
        );
    }

    return null;
};
