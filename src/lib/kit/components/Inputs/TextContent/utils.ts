import React from 'react';

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
