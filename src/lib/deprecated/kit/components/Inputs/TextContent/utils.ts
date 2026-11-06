import React from 'react';

import type {AlertProps} from '@gravity-ui/uikit';

export const loadIcon = (name: string) => {
    const Icon = React.lazy(() => {
        return new Promise((resolve) => {
            const icon = import(`@gravity-ui/icons`).then((module) => {
                if (module[name]) {
                    return {default: module[name]} as {
                        default: never;
                    };
                }

                return {
                    default: () => null,
                } as {default: never};
            });

            resolve(icon);
        });
    });

    return Icon;
};

export const isAlertView = (view: unknown): view is AlertProps['view'] => {
    return view === 'filled' || view === 'outlined';
};
