module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/**/*.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'js'],
}