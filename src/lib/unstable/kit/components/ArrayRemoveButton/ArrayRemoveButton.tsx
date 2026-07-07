import React from 'react';

import {TrashBin} from '@gravity-ui/icons';
import {Button, Icon} from '@gravity-ui/uikit';
import {useForm} from 'react-final-form';

import {getArrayItemIndex, getArrayItemParentName, isArrayItem, isTupleItem} from '../../utils';

export interface ArrayRemoveButtonProps {
    name: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ArrayRemoveButton: React.FC<ArrayRemoveButtonProps> = ({name, onClick}) => {
    const form = useForm();

    const [ready, setReady] = React.useState(false);

    const arrayItem = isArrayItem(name);
    const tupleItem = isTupleItem(name, form);

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

    React.useLayoutEffect(() => {
        setReady(true);
    }, []);

    if (ready && arrayItem && !tupleItem) {
        return (
            <Button view="flat-secondary" onClick={removeItem} qa={`${name}-remove-button`}>
                <Icon data={TrashBin} size={16} />
            </Button>
        );
    }

    return null;
};
