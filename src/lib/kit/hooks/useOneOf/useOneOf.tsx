import React from 'react';

import {Checkbox, SegmentedRadioGroup, Select, Switch} from '@gravity-ui/uikit';
import isObjectLike from 'lodash/isObjectLike';
import some from 'lodash/some';

import type {ObjectIndependentInputProps} from '../../../core';
import {TogglerCard} from '../../components';
import {block, objectKeys} from '../../utils';

import './useOneOf.scss';

const b = block('use-oneof');

const MAX_TAB_TITLE_LENGTH = 20;

export interface UseOneOfParams {
    props: ObjectIndependentInputProps;
    onTogglerChange?: (value: string) => void;
}

export const useOneOf = ({props, onTogglerChange}: UseOneOfParams) => {
    const {name, input, spec, Layout} = props;

    const specProperties = React.useMemo(
        () => (isObjectLike(spec.properties) ? spec.properties! : {}),
        [spec.properties],
    );

    const specBooleanMap = React.useMemo(
        () => spec.viewSpec.oneOfParams?.booleanMap,
        [spec.viewSpec.oneOfParams?.booleanMap],
    );

    const [oneOfValue, setOneOfValue] = React.useState(() => {
        let valueKeys: string[] | undefined;

        if (isObjectLike(input.value)) {
            const keys = Object.keys(input.value);

            if (keys.length) {
                valueKeys = keys;
            }
        }

        if (valueKeys) return valueKeys[0];

        if (spec.viewSpec.order?.length) return spec.viewSpec.order[0];

        return Object.keys(specProperties)[0];
    });

    const onOneOfChange = React.useCallback(
        ([newValue]: string[]) => {
            if (newValue !== oneOfValue) {
                input.onChange({});
                setOneOfValue(newValue);
                onTogglerChange?.(newValue);
            }
        },
        [setOneOfValue, input.onChange, oneOfValue],
    );

    const onCheckedChange = React.useCallback(
        (checked: boolean) => {
            if (specBooleanMap) {
                const value = String(checked) as 'true' | 'false';
                const newValue = specBooleanMap[value];

                onOneOfChange([newValue]);
            }
        },
        [onOneOfChange, specBooleanMap],
    );

    const checkedValue = React.useMemo(() => {
        if (specBooleanMap) {
            const keyBooleanMap = objectKeys(specBooleanMap).find(
                (key) => specBooleanMap[key] === oneOfValue,
            );

            return keyBooleanMap === 'true';
        }

        return undefined;
    }, [oneOfValue, specBooleanMap]);

    const propertiesOrder = React.useMemo(
        () => (spec.viewSpec.order?.length ? spec.viewSpec.order : Object.keys(specProperties)),
        [spec.viewSpec.order, specProperties],
    );

    const options = React.useMemo(
        () =>
            propertiesOrder.map((value) => {
                const title =
                    spec.description?.[value] ||
                    specProperties[value]?.viewSpec.layoutTitle ||
                    value ||
                    '';

                return {
                    value,
                    title,
                    content: title,
                };
            }),
        [propertiesOrder, spec.description, specProperties],
    );

    const togglerType = React.useMemo(() => {
        if (spec.viewSpec.oneOfParams?.toggler === 'card' && options.length < 4) {
            return 'card';
        }

        if (
            spec.viewSpec.oneOfParams?.toggler !== 'radio' &&
            (spec.viewSpec.oneOfParams?.toggler === 'select' ||
                options.length > 3 ||
                some(options, ({title}) => title.length > MAX_TAB_TITLE_LENGTH))
        ) {
            return 'select';
        }

        if (
            (spec.viewSpec.oneOfParams?.toggler === 'checkbox' ||
                spec.viewSpec.oneOfParams?.toggler === 'switch') &&
            options.length === 2 &&
            specBooleanMap
        ) {
            return spec.viewSpec.oneOfParams.toggler;
        }

        return 'radio';
    }, [options, spec.viewSpec.oneOfParams?.toggler, specBooleanMap]);

    const togglerInput = React.useMemo(() => {
        if (togglerType === 'card') {
            return (
                <div className={b('card')}>
                    {options.map(({value}) => {
                        const onClick = () => {
                            onOneOfChange([value]);
                        };

                        return (
                            <TogglerCard
                                title={specProperties[value]?.viewSpec.layoutTitle || ''}
                                disabled={spec.viewSpec.disabled}
                                text={spec.description?.[value] || ''}
                                description={specProperties[value]?.viewSpec.layoutDescription}
                                onClick={onClick}
                                selected={oneOfValue === value}
                                key={value}
                            />
                        );
                    })}
                </div>
            );
        }

        if (togglerType === 'select') {
            return (
                <Select
                    width="max"
                    value={[oneOfValue]}
                    onUpdate={onOneOfChange}
                    options={options}
                    disabled={spec.viewSpec.disabled}
                    filterable={options.length > 7}
                    qa={name}
                />
            );
        }

        if (togglerType === 'checkbox') {
            return (
                <div className={b('checkbox')}>
                    <Checkbox
                        checked={checkedValue}
                        onUpdate={onCheckedChange}
                        disabled={spec.viewSpec.disabled}
                        qa={name}
                    />
                </div>
            );
        }

        if (togglerType === 'switch') {
            return (
                <div className={b('switch')}>
                    <Switch
                        checked={checkedValue}
                        onUpdate={onCheckedChange}
                        disabled={spec.viewSpec.disabled}
                        qa={name}
                    />
                </div>
            );
        }

        return (
            <SegmentedRadioGroup
                value={oneOfValue}
                onChange={(event) => onOneOfChange([event.target.value])}
                disabled={spec.viewSpec.disabled}
                qa={name}
            >
                {options.map((option) => (
                    <SegmentedRadioGroup.Option key={option.value} value={option.value}>
                        {option.title}
                    </SegmentedRadioGroup.Option>
                ))}
            </SegmentedRadioGroup>
        );
    }, [
        togglerType,
        oneOfValue,
        spec.viewSpec.disabled,
        spec.description,
        name,
        options,
        onOneOfChange,
        specProperties,
        onCheckedChange,
        checkedValue,
    ]);

    const toggler = React.useMemo(() => {
        if (Layout) {
            return (
                <div
                    className={b('toggler', {
                        radio: togglerType === 'radio',
                        card: togglerType === 'card',
                    })}
                >
                    <Layout {...props}>{togglerInput}</Layout>
                </div>
            );
        }

        return <div>{togglerInput}</div>;
    }, [Layout, togglerInput, togglerType, props]);

    return {oneOfValue, specProperties, toggler, togglerInput};
};
