import React from 'react';

import {Text} from '@gravity-ui/uikit';
import {
    unstable_Menu as Menu,
    unstable_MenuItem as MenuItem,
    unstable_MenuTrigger as MenuTrigger,
} from '@gravity-ui/uikit/unstable';
import {useForm} from 'react-final-form';

import i18n from '../../../../kit/i18n';
import {SchemaRendererMode, useSchemaRendererNodeContext} from '../../../core';
import {block, isArrayItem} from '../../utils';

import './DropButton.scss';

const b = block('drop-button');

export interface DropButtonProps {
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const DropButton: React.FC<DropButtonProps> = ({onClick}) => {
    const {input, mode, name, schema, settings} = useSchemaRendererNodeContext();

    const form = useForm();

    const [open, setOpen] = React.useState(false);

    const {required} = schema?.nodeParameters?.flags || {};
    const arrayItem = isArrayItem(name);
    const overviewFlag = mode === SchemaRendererMode.Overview;

    const removeItem = React.useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            onClick?.(event);
            form.focus(name);
            form.change(name, undefined);
            form.blur(name);
        },
        [form, name, onClick],
    );

    if (!required && input.value !== undefined && !arrayItem && !overviewFlag) {
        return (
            <div className={b({open})}>
                <Menu
                    trigger={<MenuTrigger view="flat-secondary" size={settings?.size} />}
                    onOpenChange={setOpen}
                    placement="right"
                >
                    <MenuItem theme="danger" onClick={removeItem} size={settings?.size}>
                        <Text variant={settings?.textVariant}>{i18n('label_delete')}</Text>
                    </MenuItem>
                </Menu>
            </div>
        );
    }

    return null;
};
