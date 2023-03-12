import type {StorybookConfig} from '@storybook/core-common';

const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const config: StorybookConfig = {
    stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: ['@storybook/addon-essentials', '@storybook/preset-scss'],
    framework: '@storybook/react',
    webpackFinal: async (config) => {
        config.plugins?.push(new MonacoWebpackPlugin({languages: ['json']}));

        return config;
    },
};

module.exports = config;
