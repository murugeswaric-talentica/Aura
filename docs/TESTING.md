# Test Configuration for Aura

This directory contains test files for the Aura application. The tests are organized to mirror the structure of the source code.

## Test Structure
- Unit tests are placed in `__tests__` folders adjacent to the code they test
- Test files follow the naming convention of `*.test.js`

## Running Tests
To run the tests, use the following commands:

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode for development
npm run test:watch
```

## Test Libraries Used
- Jest - Test runner and assertion library
- React Testing Library - For testing React components
- Jest DOM - Custom DOM element matchers

## Test Guidelines
1. Test one component/function per test file
2. Focus on testing behavior, not implementation
3. Write descriptive test cases with clear expectations
4. Mock external dependencies when necessary
5. Aim for high coverage, especially for critical functionality

## Folder Structure
```
__tests__/                   # Test files
  ComponentName.test.js      # Tests for specific component
  ServiceName.test.js        # Tests for specific service
```