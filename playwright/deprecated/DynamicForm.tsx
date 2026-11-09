import React from 'react';

import noop from 'lodash/noop';
import {Form} from 'react-final-form';

import {DynamicField} from '../../src/lib/deprecated/core/components/Form/DynamicField';
import type {Spec} from '../../src/lib/deprecated/core/types/specs';
import {dynamicConfig} from '../../src/lib/deprecated/kit/constants/config';

export const DynamicForm = ({spec}: {spec: Spec}) => {
    const generateRandomValue = () => 'value';

    return (
        <Form initialValues={{}} onSubmit={noop}>
            {() => (
                <DynamicField
                    name="input"
                    spec={spec}
                    config={dynamicConfig}
                    generateRandomValue={generateRandomValue}
                />
            )}
        </Form>
    );
};
