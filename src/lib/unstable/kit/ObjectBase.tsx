import React from 'react';

import {Plus} from '@gravity-ui/icons';
// import {Button, Icon, Text} from '@gravity-ui/uikit';
import {Button, Icon} from '@gravity-ui/uikit';
import isObjectLike from 'lodash/isObjectLike';

// import {block, filterPropertiesForObjectInline} from '../../../kit/utils';
import {block} from '../../kit/utils';
import {Entity} from '../core';
import type {IndependentView, IndependentViewProps, JsonSchemaObject} from '../core/types';

import './ObjectBase.scss';

const b = block('object-base');

export interface ObjectBaseProps extends IndependentViewProps<JsonSchemaObject> {
    inline?: boolean;
}

export const ObjectBase: React.FC<ObjectBaseProps> = ({inline, schema, input, meta, Wrapper}) => {
    const addBtn = React.useMemo(
        () => (
            <Button
                onClick={() => input.onChange(schema.default || {})}
                disabled={schema.readOnly}
                qa={`${name}-init-obj`}
            >
                <Icon data={Plus} size={14} />
                {schema.title || null}
            </Button>
        ),
        [schema.default, schema.title, input.onChange],
    );

    const content = React.useMemo(() => {
        if (
            !schema.properties ||
            !isObjectLike(schema.properties) ||
            !Object.keys(schema.properties || {}).length
        ) {
            return null;
        }

        if (!inline && !input.value) {
            return addBtn;
        }

        // todo
        // const specProperties = inline
        //     ? filterPropertiesForObjectInline(schema.properties)
        //     : schema.properties;
        const specProperties = schema.properties;

        // todo
        // const delimiter = spec.viewSpec.delimiter;
        // const orderProperties = spec.viewSpec.order?.length
        //     ? spec.viewSpec.order
        //     : Object.keys(specProperties);
        const orderProperties = Object.keys(specProperties);

        return (
            <div className={b('content', {inline})}>
                {orderProperties.map((property: string) =>
                    specProperties[property] ? (
                        <React.Fragment key={`${input.name ? input.name + '.' : ''}${property}`}>
                            <Entity
                                schema={specProperties[property]}
                                name={`${input.name ? input.name + '.' : ''}${property}`}
                            />
                            {/* {delimiter && delimiter[property] ? (
                                <Text className={b('delimiter')}>{delimiter[property]}</Text>
                            ) : null} */}
                        </React.Fragment>
                    ) : null,
                )}
            </div>
        );
    }, [
        schema.properties,
        // spec.viewSpec.delimiter,
        // spec.viewSpec.order,
        input.value,
        inline,
        addBtn,
        input.name,
    ]);

    if (!Wrapper || !content) {
        return content;
    }

    return (
        // @ts-expect-error
        <Wrapper schema={schema} input={input} meta={meta}>
            {content}
        </Wrapper>
    );
};

export const ObjectInline: IndependentView<JsonSchemaObject> = (props) => {
    return <ObjectBase {...props} inline />;
};
