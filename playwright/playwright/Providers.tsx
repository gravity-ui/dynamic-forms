import React from 'react';

import {MobileProvider, ThemeProvider} from '@gravity-ui/uikit';

import './Providers.scss';

declare global {
    interface Window {
        __setTheme: (theme: string) => void;
    }
}

export const Providers = ({children}) => {
    const [switcherTheme, setSwitcherTheme] = React.useState<string>('light');

    if (!window.__setTheme) {
        window.__setTheme = setSwitcherTheme;
    }

    return (
        <ThemeProvider theme={switcherTheme} scoped>
            <MobileProvider>
                <body id="root">{children}</body>
            </MobileProvider>
        </ThemeProvider>
    );
};
