import React from 'react';

import type {StringIndependentView} from '../../../core';
import type {TextContentComponentProps} from '../Inputs';
import {TextContentComponent} from '../Inputs';

export const TextContentView: StringIndependentView = ({name, spec, Layout, value}) => {
    const layoutValue =
        spec.viewSpec.textContentParams?.text || spec.viewSpec.layoutDescription || value;

    const WrappedLayout = React.useMemo(() => {
        if (Layout) {
            const Component: TextContentComponentProps['Layout'] = (props) => {
                return <Layout name={name} value={layoutValue} {...props} />;
            };

            return Component;
        }

        return undefined;
    }, [Layout, layoutValue, name]);

    return <TextContentComponent spec={spec} value={value} Layout={WrappedLayout} />;
};
