import React from 'react';

import {MobileProvider, ThemeProvider} from '@gravity-ui/uikit';

import {DynamicView as DynamicViewBase} from '../../src/lib/core/components/View/DynamicView';
import {Spec} from '../../src/lib/core/types/specs';
import {FormValue} from '../../src/lib/core/types/value';
import {dynamicViewConfig} from '../../src/lib/kit/constants/config';

export const DynamicView = ({spec, value}: {spec: Spec; value: FormValue}) => {
    return (
        <ThemeProvider>
            <MobileProvider>
                <DynamicViewBase spec={spec} value={value} config={dynamicViewConfig} />
            </MobileProvider>
        </ThemeProvider>
    );
};
