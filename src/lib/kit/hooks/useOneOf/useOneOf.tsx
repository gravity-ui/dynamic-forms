import React from 'react';

import {RadioButton, Select} from '@gravity-ui/uikit';
import _ from 'lodash';

import {ObjectIndependentInputProps} from '../../../core';
import {TogglerCard} from '../../components';
import {block} from '../../utils';

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
        () => (_.isObjectLike(spec.properties) ? spec.properties! : {}),
        [spec.properties],
    );

    const [oneOfValue, setOneOfValue] = React.useState(() => {
        let valueKeys: string[] | undefined;

        if (_.isObjectLike(input.value)) {
            const keys = Object.keys(input.value);

            if (keys.length) {
                valueKeys = keys;
            }
        }

        return (valueKeys || spec.viewSpec.order || Object.keys(specProperties))[0];
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

    const options = React.useMemo(
        () =>
            (spec.viewSpec.order || Object.keys(specProperties)).map((value) => {
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
        [spec.description, spec.viewSpec.order, specProperties],
    );

    const togglerType = React.useMemo(() => {
        if (spec.viewSpec.oneOfParams?.toggler === 'card' && options.length < 3) {
            return 'card';
        }

        if (
            spec.viewSpec.oneOfParams?.toggler !== 'radio' &&
            (spec.viewSpec.oneOfParams?.toggler === 'select' ||
                options.length > 3 ||
                _.some(options, ({title}) => title.length > MAX_TAB_TITLE_LENGTH))
        ) {
            return 'select';
        }

        return 'radio';
    }, [options, spec.viewSpec.oneOfParams?.toggler]);

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

        return (
            <RadioButton
                value={oneOfValue}
                onChange={(event) => onOneOfChange([event.target.value])}
                disabled={spec.viewSpec.disabled}
                qa={name}
            >
                {options.map((option) => (
                    <RadioButton.Option key={option.value} value={option.value}>
                        {option.title}
                    </RadioButton.Option>
                ))}
            </RadioButton>
        );
    }, [
        togglerType,
        oneOfValue,
        spec.viewSpec.disabled,
        name,
        options,
        onOneOfChange,
        specProperties,
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
