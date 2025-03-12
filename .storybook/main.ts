import {StorybookConfig} from 'storybook-react-rsbuild';

const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const config: StorybookConfig = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: [
        {
            name: '@storybook/addon-essentials',
            options: {
                actions: false,
                backgrounds: false,
                controls: false,
                measure: false,
                outline: false,
                toolbars: true,
                viewport: false,
                docs: true,
            },
        },
        '@storybook/preset-scss',
        '@storybook/addon-webpack5-compiler-swc',
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
