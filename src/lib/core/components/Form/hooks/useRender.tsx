import React from 'react';

import _ from 'lodash';

import {isCorrectSpec} from '../../../helpers';
import {Spec} from '../../../types';
import {
    FieldRenderProps,
    FieldValue,
    IndependentInputEntity,
    InputEntity,
    LayoutType,
} from '../types';

export interface UseRenderParams<Value extends FieldValue, SpecType extends Spec> {
    name: string;
    spec: SpecType;
    inputEntity?: InputEntity<Value, SpecType> | IndependentInputEntity<Value, SpecType>;
    Layout?: LayoutType<Value, SpecType>;
}

export const useRender = <Value extends FieldValue, SpecType extends Spec>({
    name,
    spec,
    inputEntity,
    Layout,
}: UseRenderParams<Value, SpecType>) => {
    const render = React.useCallback(
        (props: FieldRenderProps<Value>) => {
            if (inputEntity && isCorrectSpec(spec) && _.isString(name)) {
                if (inputEntity.independent) {
                    const InputComponent = inputEntity.Component;

                    return <InputComponent spec={spec} name={name} Layout={Layout} {...props} />;
                }

                const InputComponent = inputEntity.Component;
                const input = <InputComponent spec={spec} name={name} {...props} />;

                if (Layout) {
                    return (
                        <Layout spec={spec} name={name} {...props}>
                            {input}
                        </Layout>
                    );
                }

                return input;
            }

            return null;
        },
        [spec, name, inputEntity, Layout],
    );

    return render;
};
