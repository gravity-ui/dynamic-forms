import React from 'react';

import {useField} from 'react-final-form';

import type {JsonSchema} from '../../types';
import {SchemaRendererContext} from '../SchemaRenderer/context';

import {getRenderKit, getValidate} from './utils';

export interface EntityProps {
    name: string;
    schema: JsonSchema;
}

const Component: React.FC<EntityProps> = ({name, schema}) => {
    const {
        config,
        errorMessages,
        mode,
        name: headName,
        tools: {setValidationCache, setValidationWaiters},
    } = React.useContext(SchemaRendererContext);

    const head = headName === name;

    const renderKit = React.useMemo(
        () => getRenderKit({config, mode, schema}),
        [config, mode, schema],
    );

    const options = React.useMemo(() => {
        const validate = head
            ? getValidate({
                  config,
                  errorMessages,
                  name,
                  schema,
                  setValidationCache,
                  setValidationWaiters,
              })
            : undefined;

        return {
            data: {schema},
            defaultValue: schema.default,
            subscription: {data: true, error: true, validating: true, value: true},
            validate,
        };
    }, [config, errorMessages, head, name, schema, setValidationCache, setValidationWaiters]);

    const field = useField(name, options);

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

export const Entity = React.memo(Component);
