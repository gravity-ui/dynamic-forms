import {withTheme, withLang} from './decorators';

export const decorators = [withTheme, withLang];

export const globalTypes = {
    theme: {
        defaultValue: 'light',
        toolbar: {
            title: 'Theme',
            icon: 'mirror',
            items: [
                {value: 'light', right: '☼', title: 'Light'},
                {value: 'dark', right: '☾', title: 'Dark'},
                {value: 'light-hc', right: '☼', title: 'High Contrast Light (beta)'},
                {value: 'dark-hc', right: '☾', title: 'High Contrast Dark (beta)'},
            ],
        },
    },
    lang: {
        defaultValue: 'en',
        toolbar: {
            title: 'Language',
            icon: 'globe',
            items: [
                {value: 'en', right: '🇬🇧', title: 'En'},
                {value: 'ru', right: '🇷🇺', title: 'Ru'},
            ],
        },
    },
};
