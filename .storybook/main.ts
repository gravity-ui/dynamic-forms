import type {StorybookConfig} from '@storybook/react-webpack5';

const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const config: StorybookConfig = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: [
        {
            name: '@storybook/addon-essentials',
            options: {
                controls: false,
                actions: false,
            },
        },
        '@storybook/preset-scss',
    ],
    framework: {
        name: '@storybook/react-webpack5',
        options: {fastRefresh: true},
    },
    webpackFinal: async (config) => {
        config.plugins?.push(new MonacoWebpackPlugin({languages: ['json']}));

        return config;
    },
};

module.exports = config;
