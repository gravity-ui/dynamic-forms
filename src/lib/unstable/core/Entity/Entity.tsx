import React from 'react';

import {SchemaRendererContext} from '../SchemaRendererContext';
import type {JsonSchema} from '../types';
import {useSchemaRendererField} from '../useSchemaRendererField';

import {getRenderKit} from './utils';

export interface EntityProps {
    name: string;
    schema: JsonSchema;
}

const EntityComponent: React.FC<EntityProps> = ({name, schema}) => {
    const {config, mode} = React.useContext(SchemaRendererContext);

    const renderKit = React.useMemo(
        () => getRenderKit({config, mode, schema}),
        [config, mode, schema],
    );

    const options = React.useMemo(
        () => ({
            data: {schema},
            defaultValue: schema.default,
            subscription: {
                error: true,
                submitFailed: true,
                touched: true,
                validating: true,
                value: true,
            },
        }),
        [schema],
    );

    const field = useSchemaRendererField(name, options);

    if (!renderKit.View) {
        return null;
    }

    let content = null;

    if (renderKit.independent) {
        content = (
            <renderKit.View
                {...field}
                schema={schema}
                Wrapper={renderKit.Wrapper}
                viewProps={renderKit.viewProps}
                wrapperProps={renderKit.wrapperProps}
            />
        );
    } else {
        content = <renderKit.View {...field} schema={schema} viewProps={renderKit.viewProps} />;

        if (renderKit.Wrapper) {
            content = (
                <renderKit.Wrapper {...field} schema={schema} wrapperProps={renderKit.wrapperProps}>
                    {content}
                </renderKit.Wrapper>
            );
        }
    }

    return <div>{content}</div>;
};

export const Entity = React.memo(EntityComponent);
