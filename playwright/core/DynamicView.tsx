import React from 'react';

import {DynamicView as DynamicViewBase} from '../../src/lib/deprecated/core/components/View/DynamicView';
import type {Spec} from '../../src/lib/deprecated/core/types/specs';
import type {FormValue} from '../../src/lib/deprecated/core/types/value';
import {dynamicViewConfig} from '../../src/lib/deprecated/kit/constants/config';

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
