import React from 'react';

import type {Decorator} from '@storybook/react';
import {Lang, configure} from '../../src';

export const withLang: Decorator = (Story, context) => {
    const lang = context.globals.lang;

    React.useEffect(() => {
        configure({
            lang: lang as Lang,
        });
    }, [lang]);

    return <Story key={lang} {...context} />;
};
