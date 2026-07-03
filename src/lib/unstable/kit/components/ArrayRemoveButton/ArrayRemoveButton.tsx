import React from 'react';

import {TrashBin} from '@gravity-ui/icons';
import {Button, Icon} from '@gravity-ui/uikit';
import {useForm} from 'react-final-form';

import {getArrayItemIndex, getArrayItemParentName, isArrayItem, isTupleItem} from '../../utils';

export interface ArrayRemoveButtonProps {
    name: string;
}

export const ArrayRemoveButton: React.FC<ArrayRemoveButtonProps> = ({name}) => {
    const form = useForm();

    const [ready, setReady] = React.useState(false);

    const arrayItem = isArrayItem(name);
    const tupleItem = isTupleItem(name, form);

    const removeItem = React.useCallback(() => {
        const parentName = getArrayItemParentName(name);
        const parentValue = form.getFieldState(parentName)?.value;
        const index = Number(getArrayItemIndex(name));

        if (Array.isArray(parentValue)) {
            form.change(
                parentName,
                parentValue.filter((_, i) => i !== index),
            );
        }
    }, [form, name]);

    React.useLayoutEffect(() => {
        setReady(true);
    }, []);

    if (ready && arrayItem && !tupleItem) {
        return (
            <Button view="flat-secondary" onClick={removeItem} qa={`${name}-remove-item`}>
                <Icon data={TrashBin} size={16} />
            </Button>
        );
    }

    return null;
};
