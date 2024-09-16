import React from 'react';

import {StringIndependentView} from '../../../core';
import {TextContentComponent, TextContentComponentProps} from '../Inputs';

export const TextContentView: StringIndependentView = ({name, spec, Layout, value}) => {
    const WrappedLayout = React.useMemo(() => {
        if (Layout) {
            const Component: TextContentComponentProps['Layout'] = (props) => {
                const VALUE_STUB =
                    'if u see this, please create issue about it here: https://github.com/gravity-ui/dynamic-forms/issues/new';

                return <Layout name={name} value={VALUE_STUB} {...props} />;
            };

            return Component;
        }

        return undefined;
    }, [Layout, name]);

    return <TextContentComponent spec={spec} value={value} Layout={WrappedLayout} />;
};
