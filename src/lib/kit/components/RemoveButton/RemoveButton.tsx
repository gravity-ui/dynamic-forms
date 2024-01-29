import React from 'react';

import {Ellipsis} from '@gravity-ui/icons';
import {Button, DropdownMenu, DropdownMenuItemMixed, Icon} from '@gravity-ui/uikit';

import i18n from '../../i18n';

export interface RemoveButtonProps {
    name: string;
    onDrop: () => void;
}

export const RemoveButton: React.FC<RemoveButtonProps> = ({name, onDrop}) => {
    const items: DropdownMenuItemMixed<any>[] = React.useMemo(
        () => [{text: i18n('label_delete'), action: onDrop, theme: 'danger'}],
        [onDrop],
    );

    const switcher = React.useMemo(
        () => (
            <Button view="flat" qa={`${name}-drop-item`}>
                <Icon data={Ellipsis} size={16} />
            </Button>
        ),
        [],
    );

    return <DropdownMenu switcher={switcher} items={items} />;
};
