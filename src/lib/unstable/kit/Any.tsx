import React from 'react';

import {Button} from '@gravity-ui/uikit';

import {Entity} from '../core';
import type {Control, JsonSchemaAny} from '../core/types';

export const AnyInput: Control<JsonSchemaAny> = ({input, schema}) => {
    const [state, setState] = React.useState(true);

    // React.useEffect(() => {
    //     input.onChange(undefined);
    // }, []);

    return (
        <React.Fragment>
            <Entity name={`${input.name}.bla`} schema={schema.oneOf?.[state ? 0 : 1]} />
            <Button
                onClick={() => {
                    input.onChange(undefined);
                    setState(!state);
                }}
            >
                Toggle
            </Button>
        </React.Fragment>
    );
};
