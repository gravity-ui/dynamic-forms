import React from 'react';

import {DynamicView as DynamicViewBase} from '../../src/lib/core/components/View/DynamicView';
import {Spec} from '../../src/lib/core/types/specs';
import {FormValue} from '../../src/lib/core/types/value';
import {dynamicViewConfig} from '../../src/lib/kit/constants/config';

export const DynamicView = ({
    spec,
    value,
    showLayoutDescription,
}: {
    spec: Spec;
    value: FormValue;
    showLayoutDescription?: boolean;
}) => {
    return (
        <DynamicViewBase
            spec={spec}
            value={value}
            config={dynamicViewConfig}
            showLayoutDescription={showLayoutDescription}
        />
    );
};
