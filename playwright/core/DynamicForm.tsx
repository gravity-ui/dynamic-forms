import React from 'react';

import _ from 'lodash';
import {Form} from 'react-final-form';

import {DynamicField} from '../../src/lib/core/components/Form/DynamicField';
import {Spec} from '../../src/lib/core/types/specs';
import {dynamicConfig} from '../../src/lib/kit/constants/config';

export const DynamicForm = ({spec}: {spec: Spec}) => {
    const generateRandomValue = () => 'value';

    return (
        <Form initialValues={{}} onSubmit={_.noop}>
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
