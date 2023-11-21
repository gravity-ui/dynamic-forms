import React from 'react';

import _ from 'lodash';

import {Spec} from '../../../types';
import {EMPTY_MUTATOR} from '../constants';
import {DynamicFormMutators} from '../types';

export interface UseSpecParams {
    name: string;
    spec: Spec;
    mutators: DynamicFormMutators;
}

export const useSpec = ({spec: _spec, mutators, name}: UseSpecParams) => {
    const firstRenderRef = React.useRef(true);
    const [spec, setSpec] = React.useState(() => {
        const specMutator = _.get(mutators.spec, name, EMPTY_MUTATOR);

        if (specMutator !== EMPTY_MUTATOR) {
            return _.merge(_.cloneDeep(_spec), specMutator);
        }

        return _spec;
    });

    React.useEffect(() => {
        if (!firstRenderRef.current) {
            const specMutator = _.get(mutators.spec, name, EMPTY_MUTATOR);

            if (specMutator === EMPTY_MUTATOR) {
                if (!_.isEqual(spec, _spec)) {
                    setSpec(_spec);
                }
            } else {
                const nextSpec = _.merge(_.cloneDeep(_spec), specMutator);

                if (!_.isEqual(spec, nextSpec)) {
                    setSpec(nextSpec);
                }
            }
        }
    }, [_spec, mutators, name]);

    React.useEffect(() => {
        firstRenderRef.current = false;
    }, []);

    return spec;
};
