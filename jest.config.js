module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['ts', 'html', 'js', 'json'],
    transform: {
        '^.+\\.(ts|js|html)$': 'jest-preset-angular',
    },
    transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
};