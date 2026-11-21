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
import {getQaBase} from '../../utils/qa';

const b = block('array-remove-button');

export interface ArrayRemoveButtonProps {
    name?: string;
    /** Base for the button's `data-qa`; defaults to the item's QA base */
    qa?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ArrayRemoveButton: React.FC<ArrayRemoveButtonProps> = ({
    name: nameProps,
    qa,
    onClick,
}) => {
    const {mode, name: contextName, headName, schema, settings} = useSchemaRendererNodeContext();

    const form = useForm();
    const originalDestroyFlagRef = React.useRef<boolean>(null);

    const name = nameProps ?? contextName;
    const qaBase = qa ?? (nameProps === undefined ? getQaBase(name, schema) : name);

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
                const nextParentValue = parentValue.filter((_, i) => i !== index);

                if (nextParentValue.length === 0) {
                    originalDestroyFlagRef.current = form.destroyOnUnregister;
                    form.destroyOnUnregister = false;
                }

                form.focus(parentName);
                form.change(parentName, nextParentValue);
                form.blur(parentName);
            }
        },
        [form, name, onClick],
    );

    React.useEffect(() => {
        return () => {
            if (originalDestroyFlagRef.current !== null) {
                form.destroyOnUnregister = originalDestroyFlagRef.current;
            }
        };
    }, []);

    if (arrayItem && !tupleItem && !overviewFlag) {
        return (
            <Button
                className={b()}
                view="flat-secondary"
                onClick={removeItem}
                size={settings?.size}
                qa={`${qaBase}-remove-button`}
            >
                <Icon data={TrashBin} size={16} />
            </Button>
        );
    }

    return null;
};
