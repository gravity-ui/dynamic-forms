import React from 'react';

import {Ellipsis} from '@gravity-ui/icons';
import {Button, Icon} from '@gravity-ui/uikit';
import {DropdownMenu, type DropdownMenuItemMixed} from '@gravity-ui/uikit/legacy';

import i18n from '../../i18n';

export interface RemoveButtonProps {
    name: string;
    onDrop: () => void;
    switcherClassName?: string;
}

export const RemoveButton: React.FC<RemoveButtonProps> = ({name, onDrop, switcherClassName}) => {
    const items: DropdownMenuItemMixed<any>[] = React.useMemo(
        () => [{text: i18n('label_delete'), action: onDrop, theme: 'danger'}],
        [onDrop],
    );

    const switcher = React.useMemo(
        () => (
            <Button className={switcherClassName} view="flat" qa={`${name}-drop-item`}>
                <Icon data={Ellipsis} size={16} />
            </Button>
        ),
        [switcherClassName],
    );

    return <DropdownMenu switcher={switcher} items={items} />;
};
