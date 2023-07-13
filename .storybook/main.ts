import type {StorybookConfig} from '@storybook/react-webpack5';

const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const config: StorybookConfig = {
    stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: ['@storybook/addon-essentials', '@storybook/preset-scss'],
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
