import React from 'react';

import {Text, type TextProps} from '@gravity-ui/uikit';
import {
    unstable_Menu as Menu,
    unstable_MenuItem as MenuItem,
    unstable_MenuTrigger as MenuTrigger,
} from '@gravity-ui/uikit/unstable';
import {useForm} from 'react-final-form';

import i18n from '../../../../kit/i18n';
import {
    type FieldValue,
    type JsonSchema,
    SchemaRendererMode,
    type SchemaRendererSettings,
} from '../../../core';
import {block, isArrayItem} from '../../utils';

import './DropButton.scss';

const b = block('drop-button');

export interface DropButtonProps {
    mode: SchemaRendererMode;
    name: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    schema?: JsonSchema;
    size?: SchemaRendererSettings['size'];
    value: FieldValue;
    variant?: TextProps['variant'];
}

export const DropButton: React.FC<DropButtonProps> = ({
    mode,
    name,
    onClick,
    schema,
    size,
    value,
    variant,
}) => {
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

    if (!required && value !== undefined && !arrayItem && !overviewFlag) {
        return (
            <div className={b({open})}>
                <Menu
                    trigger={<MenuTrigger view="flat-secondary" size={size} />}
                    onOpenChange={setOpen}
                    placement="right"
                >
                    <MenuItem theme="danger" onClick={removeItem} size={size}>
                        <Text variant={variant}>{i18n('label_delete')}</Text>
                    </MenuItem>
                </Menu>
            </div>
        );
    }

    return null;
};
