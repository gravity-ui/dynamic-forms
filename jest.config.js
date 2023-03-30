module.exports = {
    verbose: true,
    moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
    rootDir: '.',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    transformIgnorePatterns: ['node_modules/(?!(@gravity-ui)/)'],
    coverageDirectory: './coverage',
    collectCoverageFrom: ['src/**/*.{ts,tsx}', '!**/__stories__/**/*', '!**/*/*.stories.{ts,tsx}'],
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/test-utils/setup-tests-after.ts'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'jest-transform-css',
    },
    testMatch: ['**/*.test.[jt]s?(x)'],
};
