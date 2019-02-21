module.exports = {
  verbose: true,
  // Node env instead of default jsdom one
  testEnvironment: 'node',
  // Use ts-jest for ts files
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  // Look for tests in "tests" folder and any files that use the (.test|.spec).ts extension
  testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.ts$",
  // Add ts into the defaults (js|jsx|json|node) test file extensions
  moduleFileExtensions: ["ts", "js", "json", "node"],
  testPathIgnorePatterns: ["node_modules", "bin"]
};
