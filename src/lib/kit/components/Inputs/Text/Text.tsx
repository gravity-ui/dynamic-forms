import React from 'react';

import {Copy, CopyCheck, Eye, EyeSlash} from '@gravity-ui/icons';
import {Button, CopyToClipboard, CopyToClipboardStatus, Icon, TextInput} from '@gravity-ui/uikit';
import _ from 'lodash';

import {FieldRenderProps, NumberInputProps, StringInputProps} from '../../../../core';
import {block} from '../../../utils';

import './Text.scss';

const b = block('text');

export const Text = <T extends NumberInputProps | StringInputProps>({name, input, spec}: T) => {
    const {value, onBlur, onChange, onFocus} = input;
    const [hideValue, setHideValue] = React.useState(spec.viewSpec.type === 'password');

    const handleChange = React.useCallback(
        (value: string) => {
            (onChange as FieldRenderProps<string>['input']['onChange'])(value);
        },
        [onChange, spec],
    );

    const type = React.useMemo(() => {
        if (spec.viewSpec.type === 'password') {
            return 'password';
        }

        return 'text';
    }, [spec.viewSpec.type]);

    const additionalRightContent = React.useMemo(() => {
        if (type === 'password') {
            const onClick = () => {
                setHideValue((hideValue) => !hideValue);
            };

            return (
                <div className={b()}>
                    {input.value ? (
                        <CopyToClipboard text={String(value)} timeout={500}>
                            {(state) => (
                                <Button view="flat-secondary" className={b('button')} size="s">
                                    <Icon
                                        size={14}
                                        data={
                                            state === CopyToClipboardStatus.Pending
                                                ? Copy
                                                : CopyCheck
                                        }
                                    />
                                </Button>
                            )}
                        </CopyToClipboard>
                    ) : null}
                    <Button
                        view="flat-secondary"
                        onClick={onClick}
                        className={b('button')}
                        size="s"
                    >
                        <Icon data={hideValue ? Eye : EyeSlash} size={14} />
                    </Button>
                </div>
            );
        }

        return undefined;
    }, [hideValue, input.value, type, value]);

    return (
        <TextInput
            type={hideValue ? 'password' : 'text'}
            value={_.isNil(value) ? '' : `${value}`}
            hasClear={true}
            onBlur={onBlur}
            onFocus={onFocus}
            onUpdate={handleChange}
            disabled={spec.viewSpec.disabled}
            placeholder={spec.viewSpec.placeholder}
            autoComplete={type === 'password' ? 'new-password' : undefined}
            qa={name}
            rightContent={additionalRightContent}
        />
    );
};
