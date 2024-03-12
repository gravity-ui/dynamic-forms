import React from 'react';

import {Plus} from '@gravity-ui/icons';
import {Button, Icon, Text} from '@gravity-ui/uikit';
import isObjectLike from 'lodash/isObjectLike';
import set from 'lodash/set';

import {
    Controller,
    FieldObjectValue,
    FieldValue,
    ObjectIndependentInput,
    ObjectIndependentInputProps,
    ObjectValue,
    ValidateError,
    transformArrIn,
} from '../../../../core';
import {block, filterPropertiesForObjectInline} from '../../../utils';
import {MAX_LENGTH_DELIMITER} from '../../../constants/common';

import './ObjectBase.scss';

const b = block('object-base');

export interface ObjectBaseProps extends ObjectIndependentInputProps {
    inline?: boolean;
}

export const ObjectBase: React.FC<ObjectBaseProps> = ({
    inline,
    spec,
    name,
    Layout,
    ...restProps
}) => {
    const addBtn = React.useMemo(
        () => (
            <Button
                onClick={() =>
                    restProps.input.onChange(
                        transformArrIn<ObjectValue, FieldObjectValue>(spec.defaultValue!) || {},
                    )
                }
                disabled={spec.viewSpec?.disabled}
                qa={`${name}-init-obj`}
            >
                <Icon data={Plus} size={14} />
                {spec.viewSpec.layoutTitle || null}
            </Button>
        ),
        [spec.defaultValue, spec.viewSpec.layoutTitle, restProps.input.onChange],
    );

    const parentOnChange = React.useCallback(
        (childName: string, childValue: FieldValue, childErrors?: Record<string, ValidateError>) =>
            restProps.input.onChange(
                (currentValue) =>
                    set(
                        {...currentValue},
                        childName.split(`${restProps.input.name}.`).join(''),
                        childValue,
                    ),
                childErrors,
            ),
        [restProps.input.onChange, restProps.input.name],
    );

    const content = React.useMemo(() => {
        if (
            !spec.properties ||
            !isObjectLike(spec.properties) ||
            !Object.keys(spec.properties || {}).length
        ) {
            return null;
        }

        if (!inline && !restProps.input.value) {
            return addBtn;
        }

        const specProperties = inline
            ? filterPropertiesForObjectInline(spec.properties)
            : spec.properties;

        const delimiter =
            inline && spec.viewSpec.delimiter
                ? spec.viewSpec.delimiter.substring(0, MAX_LENGTH_DELIMITER)
                : null;

        const orderProperties = spec.viewSpec.order || Object.keys(specProperties);

        return (
            <div className={b('content', {inline})}>
                {orderProperties.map((property: string, idx: number) =>
                    specProperties[property] ? (
                        <React.Fragment key={`${name ? name + '.' : ''}${property}`}>
                            <Controller
                                value={restProps.input.value?.[property]}
                                spec={specProperties[property]}
                                name={`${name ? name + '.' : ''}${property}`}
                                parentOnChange={parentOnChange}
                                parentOnUnmount={restProps.input.parentOnUnmount}
                            />
                            {delimiter && orderProperties.length - 1 !== idx ? (
                                <Text className={b('delimiter')}>{delimiter}</Text>
                            ) : null}
                        </React.Fragment>
                    ) : null,
                )}
            </div>
        );
    }, [
        spec.properties,
        spec.viewSpec.delimiter,
        spec.viewSpec.order,
        restProps.input.value,
        restProps.input.parentOnUnmount,
        inline,
        addBtn,
        name,
        parentOnChange,
    ]);

    if (!Layout || !content) {
        return content;
    }

    return (
        <Layout spec={spec} name={name} {...restProps}>
            {content}
        </Layout>
    );
};

export const ObjectInline: ObjectIndependentInput = (props) => {
    return <ObjectBase {...props} inline />;
};
