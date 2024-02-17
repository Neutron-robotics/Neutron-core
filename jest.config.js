module.exports = {
  preset: 'ts-jest',
  clearMocks: true,
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  watchPathIgnorePatterns: ['__tests__/__mixture__'],
  testPathIgnorePatterns: ['__tests__/__mixture__']
};
